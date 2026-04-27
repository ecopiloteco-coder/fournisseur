import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X, MessageCircle, Clock, ArrowRight, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import { useTheme } from '../providers/ThemeContext';
import { useRealtimeSocket } from '../providers/RealtimeSocketProvider';
import { getNotificationBackendURL } from '../lib/api-bridge';
import { jwtDecode } from 'jwt-decode';

interface Conversation {
  roomId: string;
  projetFournisseurId: number | null;
  interneProjetId: number | null;
  projectName: string;
  status: string | null;
  lastMessage: string;
  lastSenderName?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

interface MessagingPanelProps {
  isOpen: boolean;
  onClose: () => void;
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

function formatLastTime(iso?: string): string {
  if (!iso) return '--';
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'a l\'instant';
  if (mins < 60) return `il y a ${mins} min`;
  if (mins < 24 * 60) return `il y a ${Math.floor(mins / 60)} h`;
  return d.toLocaleDateString('fr-FR');
}

export const MessagingPanel: React.FC<MessagingPanelProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { socket } = useRealtimeSocket();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatDraft, setChatDraft] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; senderType?: string; senderName?: string; message: string; createdAt?: string }>>([]);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Color scheme based on theme
  const colors = {
    light: {
      card: '#fafafa',
      foreground: '#3f5466',
      border: '#e8ebf0',
      input: '#ffffff',
      muted: '#a7acc7',
      primary: '#3d5afe',
      primaryForeground: '#ffffff'
    },
    dark: {
      card: '#3d4047',
      foreground: '#8f94a5',
      border: '#4d515e',
      input: '#3d4047',
      muted: '#6f7786',
      primary: '#6b8eff',
      primaryForeground: '#3d4047'
    }
  };

  const currentColors = colors[theme === 'dark' ? 'dark' : 'light'];

  const chatUserId = useMemo(() => {
    const token = sessionStorage.getItem('fournisseur_token');
    return user?.keycloakId || getKeycloakIdFromToken(token) || '';
  }, [user]);

  const token = sessionStorage.getItem('fournisseur_token');

  const markConversationAsRead = async (roomId: string) => {
    if (!chatUserId || !roomId) return;
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      await fetch(`${getNotificationBackendURL()}/api/chat/${roomId}/read?userId=${encodeURIComponent(chatUserId)}`, {
        method: 'PATCH',
        headers,
      });
    } catch {
    }
  };

  const openConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setConversations((prev) => prev.map((c) => (c.roomId === conv.roomId ? { ...c, unreadCount: 0 } : c)));
    void markConversationAsRead(conv.roomId);
  };

  useEffect(() => {
    if (!activeConversation || !chatUserId) {
      setChatMessages([]);
      return;
    }

    const roomId = activeConversation.roomId;
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    let mounted = true;

    const loadHistory = async () => {
      try {
        setChatLoading(true);
        const res = await fetch(`${getNotificationBackendURL()}/api/chat/${roomId}/messages`, { headers });
        const json = await res.json();
        if (!mounted) return;
        if (json?.success && Array.isArray(json.data)) {
          setChatMessages(
            json.data.map((m: any) => ({
              id: m._id || `${Date.now()}-${Math.random()}`,
              senderType: m.senderType,
              senderName: m.senderName,
              message: m.message || '',
              createdAt: m.createdAt,
            })),
          );
        } else {
          setChatMessages([]);
        }
      } catch {
        if (mounted) setChatMessages([]);
      } finally {
        if (mounted) setChatLoading(false);
      }
    };

    void loadHistory();

    const handleChatMessage = (m: any) => {
      if (m.roomId !== roomId) return;
      const nextId = m._id || `${Date.now()}-${Math.random()}`;
      setChatMessages((prev) => {
        if (prev.some((x) => x.id === nextId)) return prev;
        return [
          ...prev,
          {
            id: nextId,
            senderType: m.senderType,
            senderName: m.senderName,
            message: m.message || '',
            createdAt: m.createdAt,
          },
        ];
      });
    };

    socket?.emit('join-room', roomId);
    socket?.on('chat-message', handleChatMessage);

    return () => {
      mounted = false;
      socket?.off('chat-message', handleChatMessage);
    };
  }, [activeConversation, chatUserId, token, socket]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  useEffect(() => {
    if (!isOpen || !chatUserId) return;

    const token = sessionStorage.getItem('fournisseur_token');
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${getNotificationBackendURL()}/api/chat/conversations?userId=${encodeURIComponent(chatUserId)}`, { headers });
        const json = await res.json();
        if (json?.success && Array.isArray(json.data)) {
          setConversations(json.data);
        } else {
          setConversations([]);
        }
      } catch {
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [isOpen, chatUserId]);

  useEffect(() => {
    if (!isOpen) {
      setActiveConversation(null);
      setChatDraft('');
      setChatMessages([]);
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) =>
      c.projectName.toLowerCase().includes(q)
      || c.lastMessage.toLowerCase().includes(q)
      || (c.lastSenderName || '').toLowerCase().includes(q),
    );
  }, [conversations, search]);

  if (!isOpen) return null;

  const sendMessage = async () => {
    if (!activeConversation || !chatUserId) return;
    const trimmed = chatDraft.trim();
    if (!trimmed) return;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      await fetch(`${getNotificationBackendURL()}/api/chat/${activeConversation.roomId}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          senderId: chatUserId,
          senderName: user?.nomContact || [user?.prenom, user?.nom].filter(Boolean).join(' ').trim() || user?.email || 'Fournisseur',
          senderType: 'FOURNISSEUR',
          message: trimmed,
        }),
      });
      setChatDraft('');
    } catch {
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[9998]"
      />

      {/* Panel */}
      <div 
        style={{
          backgroundColor: currentColors.card,
          color: currentColors.foreground,
          borderColor: currentColors.border
        }}
        className="fixed right-0 top-0 bottom-0 w-[450px] z-[9999] shadow-lg flex flex-col overflow-hidden"
      >
        <>
          <div 
            style={{
              borderBottomColor: currentColors.border,
              backgroundColor: currentColors.card
            }}
            className="px-6 py-5 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <MessageCircle style={{ color: currentColors.primary }} className="w-6 h-6" />
                <h5 style={{ color: currentColors.foreground }} className="m-0 font-bold text-lg">Discussions projet</h5>
              </div>
              <button 
                onClick={onClose}
                style={{
                  backgroundColor: 'transparent',
                  color: currentColors.muted
                }}
                className="hover:bg-opacity-10 rounded-full p-2 transition-colors hover:opacity-80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-4 py-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher des conversations..."
              style={{
                borderColor: currentColors.border,
                backgroundColor: currentColors.input,
                color: currentColors.foreground
              }}
              className="w-full px-4 py-2.5 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: currentColors.card }}>
            {loading && (
              <div className="px-4 py-6 text-center text-sm" style={{ color: currentColors.muted }}>
                Chargement des discussions...
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-sm" style={{ color: currentColors.muted }}>
                Aucune discussion ouverte.
              </div>
            )}

            {!loading && filtered.map((conv) => (
              <div
                key={conv.roomId}
                style={{
                  borderBottomColor: currentColors.border,
                  color: currentColors.foreground,
                  backgroundColor: currentColors.card
                }}
                className="px-4 py-3 border-b cursor-pointer hover:bg-black/5 transition-colors"
                onClick={() => openConversation(conv)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h6 style={{ color: currentColors.foreground }} className="m-0 font-semibold text-sm truncate">
                        {conv.projectName}
                      </h6>
                      {conv.unreadCount > 0 && (
                        <span className="badge bg-danger text-white rounded-pill">{conv.unreadCount}</span>
                      )}
                    </div>
                    <p className="m-0 text-xs truncate" style={{ color: currentColors.muted }}>
                      {conv.lastSenderName ? `${conv.lastSenderName}: ` : ''}{conv.lastMessage || 'Discussion ouverte'}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px]" style={{ color: currentColors.muted }}>
                      <Clock className="w-3 h-3" />
                      <span>{formatLastTime(conv.lastMessageAt)}</span>
                      <span className="text-uppercase">{conv.status || 'inconnu'}</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-primary rounded-pill d-inline-flex align-items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (conv.projetFournisseurId) {
                        navigate(`/chiffrage/${conv.projetFournisseurId}`);
                        onClose();
                      }
                    }}
                    disabled={!conv.projetFournisseurId}
                  >
                    Ouvrir <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      </div>

      {activeConversation && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/45 p-4">
          <div
            style={{
              backgroundColor: currentColors.card,
              borderColor: currentColors.border,
              color: currentColors.foreground,
            }}
            className="w-full max-w-2xl h-[72vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderBottomColor: currentColors.border }}>
              <div className="min-w-0">
                <h6 className="m-0 font-semibold text-sm truncate">{activeConversation.projectName}</h6>
                <p className="m-0 text-xs" style={{ color: currentColors.muted }}>{activeConversation.status || 'inconnu'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-sm btn-primary rounded-pill d-inline-flex align-items-center gap-1"
                  onClick={() => {
                    if (activeConversation.projetFournisseurId) {
                      navigate(`/chiffrage/${activeConversation.projetFournisseurId}`);
                      onClose();
                    }
                  }}
                  disabled={!activeConversation.projetFournisseurId}
                >
                  Ouvrir <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  className="rounded-full p-2 hover:bg-black/10"
                  onClick={() => setActiveConversation(null)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ backgroundColor: currentColors.input }}>
              {chatLoading && <div className="text-sm" style={{ color: currentColors.muted }}>Chargement du chat...</div>}
              {!chatLoading && chatMessages.length === 0 && (
                <div className="text-sm" style={{ color: currentColors.muted }}>Aucun message.</div>
              )}
              {!chatLoading && chatMessages.map((m) => {
                const isMine = String(m.senderType || '').toUpperCase() === 'FOURNISSEUR';
                return (
                  <div key={m.id} className={`d-flex ${isMine ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div
                      className="px-3 py-2 rounded-3"
                      style={{
                        maxWidth: '78%',
                        backgroundColor: isMine ? currentColors.primary : currentColors.card,
                        color: isMine ? currentColors.primaryForeground : currentColors.foreground,
                        border: isMine ? 'none' : `1px solid ${currentColors.border}`,
                      }}
                    >
                      <p className="m-0 text-sm" style={{ whiteSpace: 'pre-wrap' }}>{m.message}</p>
                      <div className="mt-1 text-[11px] opacity-70">
                        {formatLastTime(m.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            <div className="px-3 py-3 border-top d-flex gap-2" style={{ borderTopColor: currentColors.border }}>
              <input
                type="text"
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void sendMessage();
                }}
                placeholder="Ecrire un message..."
                style={{
                  borderColor: currentColors.border,
                  backgroundColor: currentColors.input,
                  color: currentColors.foreground,
                }}
                className="form-control rounded-pill"
              />
              <button className="btn btn-primary rounded-pill" onClick={() => void sendMessage()}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
