
import { io, type Socket } from "socket.io-client";

let socket: Socket | undefined;

export function connectQuotationSocket(token: string) {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      autoConnect: false,
      auth: { token },
      transports: ["websocket", "polling"],
    });
  }

  socket.auth = { token };

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
}

export function disconnectQuotationSocket() {
  socket?.disconnect();
  socket = undefined;
}
