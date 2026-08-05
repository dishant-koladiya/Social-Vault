import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
	if (!socket) {
		socket = io(import.meta.env.VITE_BASEURL || "http://localhost:3000", {
			withCredentials: true,
			transports: ["websocket"],
		});
	}
	return socket;
};

export const disconnectSocket = () => {
	socket?.disconnect();
	socket = null;
};
