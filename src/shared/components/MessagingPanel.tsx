import React, { useState } from 'react';
import { Send, X, ArrowLeft, MessageCircle, Clock } from 'lucide-react';
import { useTheme } from '../providers/ThemeContext';

interface Message {
  id: string;
  sender: 'user' | 'other';
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  senderName: string;
  senderInitials: string;
  lastMessage: string;
  timestamp: string;
  messages: Message[];
  isRead: boolean;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    senderName: 'Cambrone_Paris_15_RF_EDP',
    senderInitials: 'CP',
    lastMessage: 'Nouvelle demande',
    timestamp: '15 mai 2026',
    isRead: true,
    messages: [
      { id: '1', sender: 'other', content: 'Lorem ipsum', timestamp: '14:30' },
      { id: '2', sender: 'other', content: 'Lorem ipsum dolor sit amet ?', timestamp: '14:35' },
      { id: '3', sender: 'user', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.', timestamp: '14:40' },
    ]
  },
  {
    id: '2',
    senderName: 'Nouvelle demande',
    senderInitials: 'ND',
    lastMessage: 'Une nouvelle demande de chiffrage est disponible',
    timestamp: '39 minutes ago',
    isRead: false,
    messages: []
  },
  {
    id: '3',
    senderName: 'Nouvelle demande',
    senderInitials: 'ND',
    lastMessage: 'Une nouvelle demande de chiffrage est disponible',
    timestamp: '48 minutes ago',
    isRead: false,
    messages: []
  },
  {
    id: '4',
    senderName: 'Nouvelle demande',
    senderInitials: 'ND',
    lastMessage: 'Une nouvelle demande de chiffrage est disponible',
    timestamp: 'à l\'instant',
    isRead: false,
    messages: []
  },
];

interface MessagingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessagingPanel: React.FC<MessagingPanelProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);

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

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setCurrentMessages(conv.messages);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    const newMessage: Message = {
      id: String(currentMessages.length + 1),
      sender: 'user',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    setCurrentMessages([...currentMessages, newMessage]);
    setMessageInput('');
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    setCurrentMessages([]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[999]"
      />

      {/* Panel */}
      <div 
        style={{
          backgroundColor: currentColors.card,
          color: currentColors.foreground,
          borderColor: currentColors.border
        }}
        className="fixed right-0 top-0 bottom-0 w-[450px] z-[1000] shadow-lg flex flex-col overflow-hidden"
      >
        {!selectedConversation ? (
          <>
            {/* Header*/}
            <div 
              style={{
                borderBottomColor: currentColors.border,
                backgroundColor: currentColors.card
              }}
              className="px-6 py-5 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <MessageCircle style={{ color: currentColors.primary }} className="w-6 h-6" />
                  <h5 style={{ color: currentColors.foreground }} className="m-0 font-bold text-lg">Messages</h5>
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

            {/* Tabs */}
            <div 
              style={{
                borderBottomColor: currentColors.border
              }}
              className="flex border-b px-4 bg-opacity-50">
              <button 
                style={{ 
                  borderBottomColor: currentColors.primary, 
                  color: currentColors.primary,
                  fontWeight: '600'
                }} 
                className="flex-1 bg-transparent border-0 border-b-2 py-4 text-sm font-semibold cursor-pointer transition-colors"
              >
                Reçus
              </button>
              <button 
                style={{ color: currentColors.muted }} 
                className="flex-1 bg-transparent border-0 border-b-2 border-transparent py-4 text-sm cursor-pointer transition-colors hover:text-opacity-80"
              >
                Non lus
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
              <input
                type="text"
                placeholder="Rechercher des conversations..."
                style={{
                  borderColor: currentColors.border,
                  backgroundColor: currentColors.input,
                  color: currentColors.foreground
                }}
                className="w-full px-4 py-2.5 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto" style={{ backgroundColor: currentColors.card }}>
              {CONVERSATIONS.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  style={{
                    borderBottomColor: currentColors.border,
                    color: currentColors.foreground,
                    backgroundColor: currentColors.card
                  }}
                  className="px-4 py-3 border-b cursor-pointer hover:bg-opacity-80 transition-all duration-150 hover:shadow-sm"
                >
                  <div className="flex gap-3 items-start">
                    <div 
                      style={{ backgroundColor: currentColors.primary }} 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm"
                    >
                      {conv.senderInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2 mb-1">
                        <h6 style={{ color: currentColors.foreground }} className="m-0 font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                          {conv.senderName}
                        </h6>
                        <small style={{ color: currentColors.muted }} className="flex-shrink-0 text-xs opacity-75">
                          {conv.timestamp}
                        </small>
                      </div>
                      <p style={{ color: currentColors.muted }} className="m-0 text-xs overflow-hidden text-ellipsis whitespace-nowrap leading-snug">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {!conv.isRead && (
                      <div style={{ backgroundColor: currentColors.primary }} className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 shadow-sm"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Conversation Header */}
            <div 
              style={{
                borderBottomColor: currentColors.border,
                backgroundColor: currentColors.card
              }}
              className="px-6 py-4 border-b flex items-center gap-4">
              <button
                onClick={handleBackToList}
                style={{
                  backgroundColor: 'transparent',
                  color: currentColors.primary
                }}
                className="rounded-lg p-2 hover:bg-opacity-10 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <h6 style={{ color: currentColors.foreground }} className="m-0 font-semibold text-base">
                  {selectedConversation.senderName}
                </h6>
                <small style={{ color: currentColors.muted }} className="flex items-center gap-1 text-xs mt-1">
                  <Clock className="w-3 h-3" />
                  15 mai 2026
                </small>
              </div>
              <button 
                onClick={onClose}
                style={{
                  backgroundColor: 'transparent',
                  color: currentColors.muted
                }}
                className="rounded-full p-2 hover:opacity-80 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div style={{ backgroundColor: currentColors.card }} className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
              {currentMessages.length > 0 ? (
                currentMessages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div style={{
                      backgroundColor: msg.sender === 'user' ? currentColors.primary : currentColors.muted,
                      color: msg.sender === 'user' ? currentColors.primaryForeground : currentColors.foreground
                    }} className={`max-w-xs rounded-2xl px-4 py-2.5 shadow-sm ${msg.sender === 'user' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                      <p className="m-0 text-sm leading-relaxed">{msg.content}</p>
                      <small style={{ opacity: 0.7 }} className="text-xs mt-1 block text-right">{msg.timestamp}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: currentColors.muted }} className="text-center flex flex-col items-center justify-center h-full gap-3">
                  <MessageCircle style={{ color: currentColors.muted }} className="w-12 h-12 opacity-20" />
                  <small className="text-sm">Aucun message</small>
                </div>
              )}
            </div>

            {/* Input */}
            <div 
              style={{
                borderTopColor: currentColors.border,
                backgroundColor: currentColors.card
              }}
              className="border-t px-4 py-4 flex gap-3 items-end">
              <input
                type="text"
                placeholder="Écrire votre message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                style={{
                  borderColor: currentColors.border,
                  backgroundColor: currentColors.input,
                  color: currentColors.foreground
                }}
                className="flex-1 px-4 py-2.5 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none max-h-24"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                style={{ 
                  backgroundColor: messageInput.trim() ? currentColors.primary : currentColors.muted,
                  opacity: messageInput.trim() ? 1 : 0.6
                }}
                className="border-0 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:shadow-md transition-all active:scale-95"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
