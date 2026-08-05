import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Loader2Icon, SendIcon, X } from "lucide-react";
import { clearChat } from "../app/features/chatSlice";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import api from "../configs/axios";
import { getSocket } from "../configs/socket";
import toast from "react-hot-toast";

const ChatBox = () => {
	const dispatch = useDispatch();
	const { user } = useAuth();
	const { listing, isOpen, chatId } = useSelector((state) => state.chat);

	const [chat, setChat] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSending, setIsSending] = useState(false);
	const [isOtherTyping, setIsOtherTyping] = useState(false);

	const typingTimeoutRef = useRef(null);
	const messagesEndRef = useRef(null);

	const fetchChat = useCallback(async () => {
		try {
			const { data } = await api.post(
				"/api/chat",
				{ listingId: listing.id, chatId },
			);
			setChat(data?.chat);
			setMessages(data?.chat?.messages || []);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			toast.error(error?.response?.data?.message || error?.message);
		}
	}, [listing, chatId]);

	useEffect(() => {
		if (listing && user) {
			setIsLoading(true);
			fetchChat();
		}
	}, [listing, user, chatId, fetchChat]);

	useEffect(() => {
		if (!isOpen) {
			setChat(null);
			setMessages([]);
			setIsLoading(true);
			setNewMessage("");
			setIsSending(false);
			setIsOtherTyping(false);
		}
	}, [isOpen]);

	// Join the chat room and listen for real-time events
	useEffect(() => {
		if (!chat?.id || !user) return;

		const socket = getSocket();
		socket.emit("chat:join", { chatId: chat.id });

		const handleNewMessage = ({ message: msg }) => {
			if (!msg || msg.chatId !== chat.id) return;
			setMessages((prev) =>
				prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
			);
			if (msg.sender_id !== user.id) {
				socket.emit("chat:read", { chatId: chat.id });
			}
		};

		const handleTyping = ({ chatId: cId, userId: senderId, isTyping }) => {
			if (cId !== chat.id || senderId === user.id) return;
			setIsOtherTyping(isTyping);
		};

		socket.on("message:new", handleNewMessage);
		socket.on("typing", handleTyping);

		return () => {
			socket.off("message:new", handleNewMessage);
			socket.off("typing", handleTyping);
			socket.emit("chat:leave", { chatId: chat.id });
		};
	}, [chat?.id, user]);

	// Mark the chat as read when it opens with unread messages from the other side
	useEffect(() => {
		if (!chat?.id || !user) return;
		if (chat.lastMessage && chat.lastMessageSenderId !== user.id) {
			getSocket().emit("chat:read", { chatId: chat.id });
		}
	}, [chat?.id, chat?.lastMessage, chat?.lastMessageSenderId, user]);

	// auto scroll
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length, isOtherTyping]);

	const handleTyping = (e) => {
		setNewMessage(e.target.value);
		if (!chat?.id) return;

		const socket = getSocket();
		socket.emit("typing:start", { chatId: chat.id });
		clearTimeout(typingTimeoutRef.current);
		typingTimeoutRef.current = setTimeout(() => {
			socket.emit("typing:stop", { chatId: chat.id });
		}, 1000);
	};

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (!newMessage.trim() || isSending || !chat?.id) return;

		setIsSending(true);
		const socket = getSocket();

		socket.emit(
			"message:send",
			{ chatId: chat.id, message: newMessage },
			(res) => {
				if (res?.ok) {
					setMessages((prev) =>
						prev.some((m) => m.id === res.message.id)
							? prev
							: [...prev, res.message],
					);
					setNewMessage("");
					socket.emit("typing:stop", { chatId: chat.id });
				} else {
					toast.error(res?.message || "Failed to send message");
				}
				setIsSending(false);
			},
		);
	};

	const handleClose = () => {
		dispatch(clearChat());
	};

	if (!isOpen || !listing) return null;

	return (
		<div className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-100 flex items-center justify-center sm:p-4">
			<div className="bg-white sm:rounded-lg shadow-2xl w-full max-w-2xl h-screen sm:h-[600px] flex flex-col">
				<div className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 sm:rounded-t-lg flex items-center justify-between">
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-lg truncate">{listing?.title}</h3>
						<p className="text-sm text-indigo-100 truncate">
							{user?.id === listing?.ownerId
								? `Chatting with buyer (${chat?.chatUser?.name || "Loading..."})`
								: `Chatting with seller (${chat?.ownerUser?.name || "Loading..."})`}
						</p>
					</div>
					<button
						onClick={handleClose}
						className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* message area */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
					{isLoading ? (
						<div className="flex items-center justify-center h-full">
							<Loader2Icon className="size-6 animate-spin text-indigo-600" />
						</div>
					) : messages.length === 0 ? (
						<div className="flex items-center justify-center h-full flex-col">
							<p className="text-gray-500 mb-2">No Messages yet</p>
							<p className="text-sm text-gray-400">Start the conversation!</p>
						</div>
					) : (
						messages.map((message) => (
							<div
								key={message.id || message.createdAt}
								className={`flex ${message.sender_id === user.id ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`max-w-[70%] rounded-lg p-3 pb-1 ${message.sender_id === user.id ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-800"}`}
								>
									<p className="text-sm break-words whitespace-pre-wrap">
										{message.message}
									</p>
									<p
										className={`text-[10px] mt-1 ${message.sender_id === user.id ? "text-indigo-200" : "text-gray-400"}`}
									>
										{format(new Date(message.createdAt), "MMM dd 'at' h:mm a")}
									</p>
								</div>
							</div>
						))
					)}
					{isOtherTyping && (
						<div className="flex justify-start">
							<div className="bg-white border border-gray-200 text-gray-800 rounded-lg p-3">
								<p className="text-sm text-gray-500">Typing...</p>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* input area */}
				{chat?.listing?.status === "active" ? (
					<form
						onSubmit={handleSendMessage}
						className="p-4 bg-white border-t border-gray-200 rounded-b-lg"
					>
						<div className="flex items-end space-x-2">
							<textarea
								value={newMessage}
								onChange={handleTyping}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleSendMessage(e);
									}
								}}
								placeholder="Type your messages..."
								className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-indigo-500 max-h-32"
								rows={1}
							/>
							<button
								disabled={!newMessage.trim() || isSending}
								type="submit"
								className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg disabled:opacity-50 transition-colors"
							>
								{isSending ? (
									<Loader2Icon className="w-5 h-5 animate-spin" />
								) : (
									<SendIcon className="w-5 h-5" />
								)}
							</button>
						</div>
					</form>
				) : (
					<div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
						<p className="text-sm text-gray-600 text-center">
							{chat ? `Listing is ${chat?.listing?.status}` : "Loading chat..."}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatBox;
