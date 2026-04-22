'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
  joinEncounter: (encounterId: string) => void;
  leaveEncounter: (encounterId: string) => void;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
  joinEncounter: () => {},
  leaveEncounter: () => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';
    const socket = io(`${url}/ws`, { autoConnect: false, withCredentials: true });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      // Auto-authenticate if we have a user ID
      const userId = localStorage.getItem('userId');
      if (userId) socket.emit('authenticate', { userId });
    });
    socket.on('disconnect', () => setConnected(false));
    socket.connect();

    return () => { socket.disconnect(); };
  }, []);

  const joinEncounter = (encounterId: string) => {
    socketRef.current?.emit('room:join_encounter', { encounterId });
  };
  const leaveEncounter = (encounterId: string) => {
    socketRef.current?.emit('room:leave_encounter', { encounterId });
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, joinEncounter, leaveEncounter }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() { return useContext(SocketContext); }

/** Subscribe to a socket event and auto-cleanup */
export function useSocketEvent<T = any>(event: string, handler: (data: T) => void) {
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
    socket.on(event, handler);
    return () => { socket.off(event, handler); };
  }, [socket, event, handler]);
}
