import React from 'react';
import socketio from 'socket.io-client';
import { apiBaseUrl } from '../../config';

export const socket = socketio.connect(apiBaseUrl, {
  transports: ['websocket'],
});

socket.on('connect_error', error => {
  // console.error('Socket connection error:', error);
  socket.emit('error', error);
});

export const SocketContext = React.createContext(socket);
