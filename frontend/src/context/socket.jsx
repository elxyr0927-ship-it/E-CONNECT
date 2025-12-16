import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

// Get auth token for socket authentication
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Create socket with current auth token
const createSocket = () => {
  const url = import.meta.env.VITE_API_BASE_URL || '';
  return io(url, {
    auth: {
      token: getAuthToken()
    }
  });
};

const SocketContext = createContext();

// Socket management functions
export const disconnectSocket = (socket) => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const connectSocket = (socket) => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(createSocket);

  const reconnectSocket = () => {
    // Disconnect existing socket
    disconnectSocket(socket);
    
    // Create new socket with updated auth token
    const newSocket = createSocket();
    setSocket(newSocket);
    
    return newSocket;
  };

  const disconnect = () => {
    disconnectSocket(socket);
  };

  const connect = () => {
    connectSocket(socket);
  };

  useEffect(() => {
    // Cleanup socket on unmount
    return () => {
      disconnectSocket(socket);
    };
  }, [socket]);

  const value = {
    socket,
    reconnectSocket,
    disconnect,
    connect
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
