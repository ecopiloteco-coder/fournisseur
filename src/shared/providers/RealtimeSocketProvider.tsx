import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { getNotificationBackendURL } from '../lib/api-bridge';
import { useAuth } from './AuthContext';

interface RealtimeSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const RealtimeSocketContext = createContext<RealtimeSocketContextType | undefined>(undefined);

export const useRealtimeSocket = () => {
  const context = useContext(RealtimeSocketContext);
  if (!context) {
    throw new Error('useRealtimeSocket must be used within a RealtimeSocketProvider');
  }
  return context;
};

interface RealtimeSocketProviderProps {
  children: ReactNode;
}

export const RealtimeSocketProvider = ({ children }: RealtimeSocketProviderProps) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const token = sessionStorage.getItem('fournisseur_token');
  const userId = useMemo(() => user?.keycloakId || user?.entrepriseId?.toString() || '', [user]);

  useEffect(() => {
    if (!userId || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const nextSocket = io(getNotificationBackendURL(), {
      transports: ['websocket'],
      auth: { token },
    });

    nextSocket.on('connect', () => {
      nextSocket.emit('join', userId);
      setIsConnected(true);
    });

    nextSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(nextSocket);

    return () => {
      nextSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [userId, token]);

  return (
    <RealtimeSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </RealtimeSocketContext.Provider>
  );
};