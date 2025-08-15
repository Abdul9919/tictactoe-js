import React, { createContext, useMemo } from 'react';
import { io } from 'socket.io-client';

// Create the context
const SocketContext = createContext(null);

// Create the provider
export const SocketProvider = ({ children }) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const socket = useMemo(
    () =>
      io(serverUrl, {
        transports: ['websocket'],
      }),
    [serverUrl]
  );

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext
