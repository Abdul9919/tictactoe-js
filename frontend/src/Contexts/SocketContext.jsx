import React, { createContext, useMemo } from 'react';
import { io } from 'socket.io-client';

// Create the context
const SocketContext = createContext(null);

// Create the provider
export const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () =>
      io('http://192.168.18.41:5000', {
        transports: ['websocket'],
      }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext
