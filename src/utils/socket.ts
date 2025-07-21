import { Server } from 'socket.io';

let io: Server;

export const initializeSocket = (serverIo: Server) => {
  io = serverIo;
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const getSocket = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
};