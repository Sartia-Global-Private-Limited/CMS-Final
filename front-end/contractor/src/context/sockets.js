import React from "react";
import socketio from "socket.io-client";

export const socket = socketio.connect(process.env.REACT_APP_API_URL, {
  transports: ["websocket"],
});

export const SocketContext = React.createContext();
