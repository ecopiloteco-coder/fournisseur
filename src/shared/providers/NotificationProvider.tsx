import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import { getNotificationBackendURL } from '../lib/api-bridge';
import { useAuth } from './AuthContext';
import { useRealtimeSocket } from './RealtimeSocketProvider';

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  actionUrl?: string | null;
  projetFournisseurId?: string | null;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
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

function getKeycloakIdFromToken(token: string | null): string | undefined {
  if (!token) return undefined;
  try {
    const decoded = jwtDecode<{ sub?: string }>(token);
    return decoded.sub || undefined;
  } catch {
    return undefined;
  }
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user } = useAuth();
  const { socket } = useRealtimeSocket();
  const [notifications, setNotifications] = useState<Notification[]>([])
  const notificationsRef = useRef<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'A l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const normalizeType = (value?: string): Notification['type'] => {
    const type = (value || 'info').toLowerCase();
    if (type.includes('warn')) return 'warning';
    if (type.includes('error')) return 'error';
    if (type.includes('success') || type.includes('accepte') || type.includes('soumis')) return 'success';
    return 'info';
  };

  const playNotificationSound = () => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.value = 0.03;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
    }
  };

  const showBrowserNotification = (n: Notification) => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    if (!document.hidden) return;

    try {
      const browserNotif = new Notification(n.title, {
        body: n.desc,
        tag: n.id,
      });
      browserNotif.onclick = () => {
        window.focus();
      };
    } catch {
    }
  };

  const mapRawNotification = (raw: any): Notification => {
    const createdAt = raw.createdAt || new Date().toISOString();
    return {
      id: raw._id || raw.id || String(Date.now()),
      title: raw.subject || raw.title || 'Nouvelle notification',
      desc: raw.content || raw.message || raw.contenu || '',
      time: formatTime(createdAt),
      read: Boolean(raw.isRead ?? raw.read),
      type: normalizeType(raw.type),
      actionUrl: raw?.metadata?.actionUrl || raw.actionUrl || null,
      projetFournisseurId: raw?.metadata?.projetFournisseurId || raw.projetFournisseurId || null,
      createdAt,
    };
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const token = sessionStorage.getItem('fournisseur_token');
    const userId = user?.keycloakId || user?.entreprisePublicId || getKeycloakIdFromToken(token) || String(user?.entrepriseId || '');
    void fetch(`${getNotificationBackendURL()}/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ userId }),
    });
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const token = sessionStorage.getItem('fournisseur_token');
    const ids = [user?.keycloakId, user?.entreprisePublicId].filter(Boolean).join(',');

    void fetch(`${getNotificationBackendURL()}/api/notifications/read-all?userIds=${encodeURIComponent(ids)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  const addNotification = (notification: Notification) => {
    setNotifications(prev => {
      const withoutDuplicate = prev.filter(n => n.id !== notification.id);
      return [notification, ...withoutDuplicate];
    });
    
    // Trigger sonner toast
    const toastFn = notification.type === 'success' ? toast.success : 
                  notification.type === 'error' ? toast.error : 
                  notification.type === 'warning' ? toast.warning : toast.info;
    
    toastFn(notification.title, {
      description: notification.desc,
      duration: 5000,
    });

    playNotificationSound();
    showBrowserNotification(notification);
  }

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

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

    addNotification({
      id: String(Date.now()),
      title: 'Signal envoye',
      desc: 'Votre alerte a ete transmise a l\'entreprise.',
      time: 'A l\'instant',
      read: false,
      type: 'success',
      createdAt: new Date().toISOString(),
      actionUrl: null,
      projetFournisseurId: null,
    })
  }

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ecopilot_signals' && e.newValue) {
        try {
          const allSignals = JSON.parse(e.newValue)
          const relances = allSignals.filter((s: any) =>
            s.to === 'supplier' && !notificationsRef.current.some(n => n.id === String(s.id))
          )
          relances.forEach((s: any) => {
            addNotification({
              id: String(s.id),
              title: 'Relance Entreprise',
              desc: s.message,
              time: 'A l\'instant',
              read: false,
              type: 'warning',
              createdAt: new Date().toISOString(),
              actionUrl: null,
              projetFournisseurId: null,
            })
          })
        } catch (err) {
          console.error("Error parsing signals", err)
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default' && user) {
      void Notification.requestPermission();
    }
  }, [user]);

  // Initial load + realtime socket notifications
  useEffect(() => {
    if (!user) return;

    const token = sessionStorage.getItem('fournisseur_token');
    const ids = [user.keycloakId, user.entreprisePublicId].filter(Boolean).join(',');
    
    const loadNotifications = async () => {
      try {
        const response = await fetch(`${getNotificationBackendURL()}/api/notifications?userIds=${encodeURIComponent(ids)}&limit=200`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await response.json();
        if (json?.success && Array.isArray(json.data)) {
          setNotifications(json.data.map(mapRawNotification));
        }
      } catch (err) {
        console.error('Unable to load notifications', err);
      }
    };
    void loadNotifications();

    if (!socket) return;

    const handleNotification = (notif: any) => {
      addNotification(mapRawNotification(notif));
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [user, socket]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification, sendSignal }}>
      {children}
    </NotificationContext.Provider>
  )
}
