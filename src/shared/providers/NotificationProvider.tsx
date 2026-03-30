import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client';
import { getBackendURL, getNotificationBackendURL } from '../lib/api-bridge';
import { useAuth } from './AuthContext';

interface Notification {
  id: number;
  signalId?: number | null;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  addNotification: (title: string, desc: string, type?: Notification['type'], signalId?: number | null) => void;
  sendSignal: (to: string, type: string, message: string, extra?: any) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'Nouvelle Demande', desc: 'Une nouvelle demande de chiffrage est disponible.', time: 'il y a 2h', read: false, type: 'info' },
    { id: 2, title: 'Échéance Demain', desc: 'Rendu du chiffrage "Résidence Lilas" demain.', time: 'il y a 5h', read: false, type: 'warning' }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const addNotification = (title: string, desc: string, type: Notification['type'] = 'info', signalId: number | null = null) => {
    const NewNotif: Notification = {
      id: Date.now() + Math.random(),
      signalId,
      title,
      desc,
      time: 'Maintenant',
      read: false,
      type
    }
    setNotifications(prev => [NewNotif, ...prev])
  }

  const sendSignal = (to: string, type: string, message: string, extra: any = {}) => {
    const newSignal = {
      id: Date.now() + Math.random(),
      from: 'Fournisseur BTP',
      to,
      type,
      message,
      date: new Date().toISOString(),
      ...extra
    }
    const existing = JSON.parse(localStorage.getItem('ecopilot_signals') || '[]')
    localStorage.setItem('ecopilot_signals', JSON.stringify([...existing, newSignal]))

    addNotification('Signal envoyé', 'Votre alerte a été transmise à l\'entreprise.', 'success')
  }

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ecopilot_signals' && e.newValue) {
        try {
          const allSignals = JSON.parse(e.newValue)
          const relances = allSignals.filter((s: any) => 
            s.to === 'supplier' && !notifications.some(n => n.signalId === s.id)
          )
          relances.forEach((s: any) => {
            addNotification('Relance Entreprise', s.message, 'warning', s.id)
          })
        } catch (err) {
          console.error("Error parsing signals", err)
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [notifications])

  // Real-time Socket.io Connection for backend notifications
  useEffect(() => {
    if (!user) return;
    
    const token = sessionStorage.getItem('fournisseur_token');
    const userId = user.keycloakId || String(user.entrepriseId);
    
    const newSocket = io(getNotificationBackendURL(), {
      transports: ['websocket'],
      auth: { token }
    });

    newSocket.on('connect', () => {
      newSocket.emit('join', userId);
    });

    newSocket.on('notification', (notif: any) => {
      addNotification(
        notif.title || 'Nouvelle Notification', 
        notif.message || notif.contenu || '', 
        notif.type || 'info', 
        notif.projetId || notif.referenceId || null
      );
    });

    setSocket(newSocket);

    return () => { newSocket.disconnect(); };
  }, [user]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification, sendSignal }}>
      {children}
    </NotificationContext.Provider>
  )
}
