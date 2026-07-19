import prisma from "../configs/prisma.js";

export const getChat = async (req, res) => {
	try {
		const userId = req.user.id;
		const { listingId, chatId } = req.body; // ✅ not req.body()

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
				include: {
					listing: true,
					ownerUser: true,
					chatUser: true,
					messages: true,
				},
			});
		} else {
			existingChat = await prisma.chat.findFirst({
				where: { listingId, chatUserId: userId, ownerUserId: listing.ownerId },
				include: {
					listing: true,
					ownerUser: true,
					chatUser: true,
					messages: true,
				},
			});
		}

		if (existingChat) {
			let chatData = existingChat;

			if (existingChat.isLastMessageRead === false) {
				const lastMessage =
					existingChat.messages[existingChat.messages.length - 1];
				const isLastMessageSentByMe = lastMessage?.sender_id === userId;

				if (!isLastMessageSentByMe) {
					await prisma.chat.update({
						where: { id: existingChat.id },
						data: { isLastMessageRead: true },
					});
				}
			}

			return res.json({ chat: chatData }); // ✅ was return null before
		}

		const newChat = await prisma.chat.upsert({
			where: {
				Chat_chatUserId_ownerUserId_listingId_key: {
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
			include: {
				listing: true,
				ownerUser: true,
				chatUser: true,
				messages: true,
			},
		});

		return res.status(201).json({ chat: newChat });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.code || error.message });
	}
};

export const getAllUserChats = async (req, res) => {
	try {
		const userId = req.user.id;

		const chats = await prisma.chat.findMany({
			where: {
				OR: [{ chatUserId: userId }, { ownerUserId: userId }],
			},
			include: {
				listing: true,
				ownerUser: true,
				chatUser: true,
			},
			orderBy: {
				updatedAt: "desc",
			},
		});

		return res.json({ chats });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.code || error.message });
	}
};

export const sendChatMessage = async (req, res) => {
	try {
		const userId = req.user.id;
		const { chatId, message } = req.body;

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
				listing: true,
			},
		});

		if (!chat) {
			return res.status(404).json({ message: "Chat not found" });
		} else if (chat.listing.status !== "active") {
			return res.status(400).json({
				message: `Listing is ${chat.listing.status}`,
			});
		}

		const newMessage = {
			message,
			sender_id: userId,
			chatId,
			createdAt: new Date(),
		};

		await prisma.message.create({
			data: newMessage,
		});

		await prisma.chat.update({
			where: { id: chatId },
			data: {
				lastMessage: newMessage.message,
				isLastMessageRead: false,
				lastMessageSenderId: userId,
			},
		});

		res.json({ message: "Message Sent", newMessage });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.code || error.message });
	}
};
