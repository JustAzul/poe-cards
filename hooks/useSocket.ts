import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export type SocketIoClient = typeof io.Socket;

const socket: SocketIoClient = io(/* '//localhost:3001', { transport: ['websocket'] } */);

export default function useSocket(callback?: Function) {
  const [activeSocket, setActiveSocket] = useState<SocketIoClient>(socket);

  useEffect(() => {
    if (activeSocket ?? !socket) return;
    // eslint-disable-next-line no-unused-expressions
    callback && callback(socket);
    setActiveSocket(socket);
  }, [socket]);

  return activeSocket;
}
