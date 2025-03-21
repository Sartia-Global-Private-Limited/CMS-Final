import React from 'react';
import socketio from 'socket.io-client';

export const socket = socketio.connect(process.env.REACT_APP_API_URL, { transports: ['websocket'] });
// export const socket = socketio.connect('http://192.168.0.87:8080', {
//   transports: ['websocket'],
// });
export const SocketContext = React.createContext();