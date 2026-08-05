import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "./prisma.js";

const CHAT_LIST_INCLUDE = {
	listing: true,
	ownerUser: { select: { id: true, name: true, email: true, image: true } },
	chatUser: { select: { id: true, name: true, email: true, image: true } },
};

const getUserFromSocket = async (socket) => {
	const cookie = socket.handshake.headers.cookie;
	const token = cookie?.match(/(?:^|;\s*)token=([^;]*)/)?.[1];

	if (!token) return null;

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: { id: true, email: true, name: true, image: true },
		});
	} catch {
		return null;
	}
};

const getParticipatingChat = (chatId, userId) =>
	prisma.chat.findFirst({
		where: {
			id: chatId,
			OR: [{ chatUserId: userId }, { ownerUserId: userId }],
		},
	});

export const createSocketServer = (httpServer) => {
	const io = new Server(httpServer, {
		cors: {
			origin: process.env.FRONTEND_URL || "http://localhost:5173",
			credentials: true,
		},
	});

	io.use(async (socket, next) => {
		const user = await getUserFromSocket(socket);
		if (!user) return next(new Error("Unauthorized"));
		socket.user = user;
		next();
	});

	io.on("connection", (socket) => {
		console.log(`Socket connected: ${socket.user.id} (${socket.user.name})`);

		socket.on("chat:join", async ({ chatId }, cb) => {
			try {
				const chat = await getParticipatingChat(chatId, socket.user.id);
				if (!chat) return cb?.({ ok: false, message: "Chat not found" });

				socket.join(`chat:${chatId}`);
				socket.data.chatId = chatId;
				cb?.({ ok: true });
			} catch (error) {
				console.error("chat:join error:", error);
				cb?.({ ok: false, message: "Failed to join chat" });
			}
		});

		socket.on("chat:leave", ({ chatId }) => {
			if (chatId) socket.leave(`chat:${chatId}`);
		});

		socket.on("message:send", async ({ chatId, message }, cb) => {
			try {
				if (!chatId || !message?.trim()) {
					return cb?.({ ok: false, message: "chatId and message are required" });
				}

				const chat = await getParticipatingChat(chatId, socket.user.id);
				if (!chat) return cb?.({ ok: false, message: "Chat not found" });

				const listing = await prisma.listing.findUnique({
					where: { id: chat.listingId },
					select: { status: true },
				});

				if (listing?.status !== "active") {
					return cb?.({
						ok: false,
						message: `Listing is ${listing?.status}. Cannot send messages.`,
					});
				}

				const trimmedMessage = message.trim();

				const newMessage = await prisma.message.create({
					data: {
						message: trimmedMessage,
						sender_id: socket.user.id,
						chatId,
					},
				});

				const updatedChat = await prisma.chat.update({
					where: { id: chatId },
					data: {
						lastMessage: trimmedMessage,
						isLastMessageRead: false,
						lastMessageSenderId: socket.user.id,
					},
					include: CHAT_LIST_INCLUDE,
				});

				io.to(`chat:${chatId}`).emit("message:new", { message: newMessage });
				io.to(`chat:${chatId}`).emit("chat:update", { chat: updatedChat });

				cb?.({ ok: true, message: newMessage });
			} catch (error) {
				console.error("message:send error:", error);
				cb?.({ ok: false, message: error?.message || "Failed to send message" });
			}
		});

		socket.on("typing:start", ({ chatId }) => {
			socket.to(`chat:${chatId}`).emit("typing", {
				chatId,
				userId: socket.user.id,
				isTyping: true,
			});
		});

		socket.on("typing:stop", ({ chatId }) => {
			socket.to(`chat:${chatId}`).emit("typing", {
				chatId,
				userId: socket.user.id,
				isTyping: false,
			});
		});

		socket.on("chat:read", async ({ chatId }, cb) => {
			try {
				const chat = await getParticipatingChat(chatId, socket.user.id);
				if (!chat) return cb?.({ ok: false, message: "Chat not found" });

				const updated = await prisma.chat.update({
					where: { id: chatId },
					data: { isLastMessageRead: true },
					select: { id: true, isLastMessageRead: true, lastMessageSenderId: true },
				});

				socket.to(`chat:${chatId}`).emit("chat:read", {
					chatId,
					readerId: socket.user.id,
					isLastMessageRead: true,
					lastMessageSenderId: updated.lastMessageSenderId,
				});

				cb?.({ ok: true });
			} catch (error) {
				console.error("chat:read error:", error);
				cb?.({ ok: false, message: "Failed to mark as read" });
			}
		});

		socket.on("disconnect", () => {
			console.log(`Socket disconnected: ${socket.user.id}`);
		});
	});

	return io;
};
