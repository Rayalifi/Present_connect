import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { APP_CONFIG } from '../utils/constants';

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [latestScan, setLatestScan] = useState(null);

  useEffect(() => {
    const socketInstance = io(APP_CONFIG.SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketInstance.on('connect', () => {
      console.log('[Socket.IO Connected]', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket.IO Disconnected]');
      setIsConnected(false);
    });

    // Listen for live RFID scans
    socketInstance.on('attendance:scanned', (data) => {
      console.log('[Real-time Scan Event]', data);
      setLatestScan(data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const value = {
    socket,
    isConnected,
    latestScan,
    clearLatestScan: () => setLatestScan(null)
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
