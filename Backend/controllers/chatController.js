import prisma from "../configs/prisma.js";

const CHAT_INCLUDE = {
	listing: true,
	ownerUser: { select: { id: true, name: true, email: true, image: true } },
	chatUser: { select: { id: true, name: true, email: true, image: true } },
	messages: { orderBy: { createdAt: "asc" } },
};

const CHAT_LIST_INCLUDE = {
	listing: true,
	ownerUser: { select: { id: true, name: true, email: true, image: true } },
	chatUser: { select: { id: true, name: true, email: true, image: true } },
};

const MAX_MESSAGE_LENGTH = 5000;

export const getChat = async (req, res) => {
	try {
		const userId = req.user.id;
		const { listingId, chatId } = req.body;

		if (!listingId || typeof listingId !== "string") {
			return res.status(400).json({ message: "listingId is required" });
		}

		const listing = await prisma.listing.findUnique({
			where: { id: listingId },
		});

		if (!listing) {
			return res.status(404).json({ message: "Listing not found" });
		}

		let existingChat = null;

		if (chatId) {
			existingChat = await prisma.chat.findFirst({
				where: {
					id: chatId,
					OR: [{ chatUserId: userId }, { ownerUserId: userId }],
				},
				include: CHAT_INCLUDE,
			});
		} else {
			existingChat = await prisma.chat.findFirst({
				where: {
					listingId,
					chatUserId: userId,
					ownerUserId: listing.ownerId,
				},
				include: CHAT_INCLUDE,
			});
		}

		if (existingChat) {
			if (
				existingChat.isLastMessageRead === false &&
				existingChat.messages.length > 0
			) {
				const lastMessage =
					existingChat.messages[existingChat.messages.length - 1];
				const isLastMessageSentByMe = lastMessage?.sender_id === userId;

				if (!isLastMessageSentByMe) {
					const updatedChat = await prisma.chat.update({
						where: { id: existingChat.id },
						data: { isLastMessageRead: true },
						include: CHAT_INCLUDE,
					});
					return res.json({ chat: updatedChat });
				}
			}

			return res.json({ chat: existingChat });
		}

		const newChat = await prisma.chat.upsert({
			where: {
				chatUserId_ownerUserId_listingId: {
					chatUserId: userId,
					ownerUserId: listing.ownerId,
					listingId,
				},
			},
			update: {},
			create: {
				listingId,
				chatUserId: userId,
				ownerUserId: listing.ownerId,
			},
			include: CHAT_INCLUDE,
		});

		return res.status(201).json({ chat: newChat });
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch chat",
		});
	}
};

export const getAllUserChats = async (req, res) => {
	try {
		const userId = req.user.id;

		const chats = await prisma.chat.findMany({
			where: {
				OR: [{ chatUserId: userId }, { ownerUserId: userId }],
			},
			include: CHAT_LIST_INCLUDE,
			orderBy: {
				updatedAt: "desc",
			},
		});

		return res.json({ chats });
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch chats" });
	}
};

export const sendChatMessage = async (req, res) => {
	try {
		const userId = req.user.id;
		const { chatId, message } = req.body;

		if (!chatId || typeof chatId !== "string" || !message?.trim()) {
			return res
				.status(400)
				.json({ message: "chatId and message are required" });
		}

		const trimmedMessage = message.trim();

		if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
			return res.status(400).json({ message: `Message must be ${MAX_MESSAGE_LENGTH} characters or less` });
		}

		const chat = await prisma.chat.findFirst({
			where: {
				AND: [
					{ id: chatId },
					{
						OR: [{ chatUserId: userId }, { ownerUserId: userId }],
					},
				],
			},
			include: {
				listing: { select: { status: true } },
			},
		});

		if (!chat) {
			return res.status(404).json({ message: "Chat not found" });
		}

		if (chat.listing.status !== "active") {
			return res.status(400).json({
				message: `Listing is ${chat.listing.status}. Cannot send messages.`,
			});
		}

		const newMessage = await prisma.message.create({
			data: {
				message: trimmedMessage,
				sender_id: userId,
				chatId,
			},
		});

		await prisma.chat.update({
			where: { id: chatId },
			data: {
				lastMessage: trimmedMessage,
				isLastMessageRead: false,
				lastMessageSenderId: userId,
			},
		});

		res.json({ message: "Message sent", newMessage });
	} catch (error) {
		res.status(500).json({ message: "Failed to send message" });
	}
};
