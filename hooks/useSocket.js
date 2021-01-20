import { useEffect, useState } from "react";
import io from "socket.io-client";

//const Url = "http://127.0.0.1:4001";
const socket = io();

export default function useSocket(cb) {
	const [activeSocket, setActiveSocket] = useState(null);

	useEffect(() => {
		// debug("Socket updated", { socket, activeSocket });
		if (activeSocket || !socket) return;
		cb && cb(socket);
		setActiveSocket(socket);
		return function cleanup() {
			// debug("Running useSocket cleanup", { socket });
			socket.off("ping", cb);
		};
	}, [socket]);

	return activeSocket;
}