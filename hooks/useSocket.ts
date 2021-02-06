import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export type SocketIoClient = typeof io.Socket;

const socket: SocketIoClient = io();

export default function useSocket(callback?: Function) {
	const [activeSocket, setActiveSocket] = useState<SocketIoClient>(socket);

	useEffect(() => {
		if (activeSocket ?? !socket) return;
		callback && callback(socket);
		setActiveSocket(socket);
	}, [socket]);

	return activeSocket;
}