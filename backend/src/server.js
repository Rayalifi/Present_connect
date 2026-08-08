const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const { initializeDatabase } = require('./config/database');
const { initSocket } = require('./config/socket');

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 1. Inisialisasi Database Pool
    await initializeDatabase();

    // 2. Buat HTTP server yang menggabungkan Express dan Socket.IO
    const httpServer = http.createServer(app);

    // 3. Inisialisasi Socket.IO
    initSocket(httpServer);

    // 4. Dengarkan request
    httpServer.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🚀 HIMATIF Connect Backend berjalan di port:${PORT}`);
      console.log(`📡 WebSocket / Socket.IO aktif untuk pembaruan realtime`);
      console.log(`🎯 RFID Scan Endpoint: http://localhost:${PORT}/api/rfid/scan`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error('❌ Gagal menjalankan server backend:', error);
    process.exit(1);
  }
}

startServer();
