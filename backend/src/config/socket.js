const { Server } = require('socket.io');

let io = null;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client terhubung: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client terputus: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io belum diinisialisasi!');
  }
  return io;
}

function broadcastEvent(eventName, data) {
  if (io) {
    io.emit(eventName, data);
  }
}

module.exports = {
  initSocket,
  getIO,
  broadcastEvent
};
