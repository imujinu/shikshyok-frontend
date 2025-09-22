import io from "socket.io-client";

export const socket = io("http://localhost:3000");

export const connect = () => {
  socket.connect();
};

export const disconnect = () => {
  socket.disconnect();
};
