import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell } from 'lucide-react';
import { useTheme } from '../providers/ThemeContext';
import { useNotifications } from '../providers/NotificationProvider';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [selectedTab, setSelectedTab] = useState<'tous' | 'nonlus'>('tous');

  const navigateFromNotification = (notif: any) => {
    const fallback = notif.projetFournisseurId ? `/chiffrage/${notif.projetFournisseurId}` : '/chiffrage/demandes';
    const target = notif.actionUrl || fallback;
    navigate(target);
    onClose();
  };

  // Color scheme based on theme
  const colors = {
    light: {
      card: '#fafafa',
      foreground: '#3f5466',
      border: '#e8ebf0',
      input: '#ffffff',
      muted: '#a7acc7',
      primary: '#3d5afe',
      primaryForeground: '#ffffff',
      sectionBg: '#f5f6fa'
    },
    dark: {
      card: '#3d4047',
      foreground: '#8f94a5',
      border: '#4d515e',
      input: '#3d4047',
      muted: '#6f7786',
      primary: '#6b8eff',
      primaryForeground: '#3d4047',
      sectionBg: '#2a2c31'
    }
  };

  const currentColors = colors[theme === 'dark' ? 'dark' : 'light'];

  // Filter notifications
  const filteredNotifications = selectedTab === 'nonlus'
    ? notifications.filter(n => !n.read)
    : notifications;

  // Group notifications by date
  const groupedNotifications = {
    nouveau: filteredNotifications.filter((_, idx) => idx < 3),
    ancien: filteredNotifications.filter((_, idx) => idx >= 3)
  };

  if (!isOpen) return null;

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
        className="fixed right-0 top-0 bottom-0 w-[480px] z-[9999] shadow-lg flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div
          style={{
            borderBottomColor: currentColors.border,
            backgroundColor: currentColors.card
          }}
          className="px-6 py-5 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bell style={{ color: currentColors.primary }} className="w-6 h-6" />
              <h5 style={{ color: currentColors.foreground }} className="m-0 font-bold text-lg">Notifications</h5>
            </div>
            <button
              onClick={onClose}
              style={{ color: currentColors.muted }}
              className="rounded-full p-2 hover:opacity-80 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{ borderBottomColor: currentColors.border }}
          className="flex gap-2 border-b px-6 py-4">
          <button
            onClick={() => setSelectedTab('tous')}
            style={{
              backgroundColor: selectedTab === 'tous' ? currentColors.primary : 'transparent',
              color: selectedTab === 'tous' ? currentColors.primaryForeground : currentColors.foreground
            }}
            className="px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all hover:opacity-90"
          >
            Tous
          </button>
          <button
            onClick={() => setSelectedTab('nonlus')}
            style={{
              backgroundColor: selectedTab === 'nonlus' ? currentColors.primary : 'transparent',
              color: selectedTab === 'nonlus' ? currentColors.primaryForeground : currentColors.foreground
            }}
            className="px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all hover:opacity-90"
          >
            Non lus
          </button>
          <button
            onClick={markAllAsRead}
            style={{ color: currentColors.primary }}
            className="ml-auto text-sm font-semibold cursor-pointer hover:opacity-80 transition-all"
          >
            Tout lire
          </button>
        </div>

        {/* Notifications List with Timeline */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Timeline background line */}
          <div
            style={{ backgroundColor: currentColors.primary }}
            className="absolute right-6 top-0 bottom-0 w-1 opacity-30"
          />

          <div style={{ backgroundColor: currentColors.card }}>
            {filteredNotifications.length > 0 ? (
              <>
                {/* Nouveau Section */}
                {groupedNotifications.nouveau.length > 0 && (
                  <div>
                    <div
                      style={{
                        backgroundColor: currentColors.sectionBg,
                        borderBottomColor: currentColors.border
                      }}
                      className="sticky top-0 px-6 py-3 border-b z-10">
                      <h6 style={{ color: currentColors.foreground }} className="m-0 font-bold text-sm">
                        Nouveau
                      </h6>
                    </div>
                    <div>
                      {groupedNotifications.nouveau.map((notif, idx) => (
                        <div
                          key={notif.id}
                          style={{
                            borderBottomColor: currentColors.border,
                            backgroundColor: !notif.read ? currentColors.sectionBg : 'transparent'
                          }}
                          className="px-6 py-4 border-b hover:shadow-sm transition-all relative cursor-pointer"
                        >
                          <div className="flex gap-4 items-start">
                            {/* Avatar placeholder */}
                            <div
                              style={{
                                backgroundColor: currentColors.border,
                                borderColor: currentColors.border
                              }}
                              className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center border">
                              <Bell style={{ color: currentColors.muted }} className="w-6 h-6 opacity-50" />
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Content */}
                              <div
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateFromNotification(notif);
                                }}
                              >
                                <div className="flex justify-between items-start gap-2 mb-1">
                                  <h6 style={{ color: currentColors.foreground }} className="m-0 font-semibold text-sm leading-tight">
                                    {notif.title}
                                  </h6>
                                  <small style={{ color: currentColors.muted }} className="flex-shrink-0 text-xs whitespace-nowrap">
                                    {notif.time}
                                  </small>
                                </div>
                                <p style={{ color: currentColors.muted }} className="m-0 text-xs leading-normal mb-3">
                                  {notif.desc}
                                </p>
                              </div>

                              {/* Action buttons */}
                              <div className="flex gap-2 items-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigateFromNotification(notif);
                                  }}
                                  style={{
                                    backgroundColor: currentColors.primary,
                                    color: currentColors.primaryForeground,
                                    border: `1px solid ${currentColors.primary}`
                                  }}
                                  className="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer hover:opacity-90 transition-all"
                                >
                                  Voir
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Archive action
                                  }}
                                  style={{
                                    backgroundColor: 'transparent',
                                    color: currentColors.muted,
                                    border: `1px solid ${currentColors.border}`
                                  }}
                                  className="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer hover:opacity-90 transition-all"
                                >
                                  Archiver
                                </button>
                                {!notif.read && (
                                  <div
                                    style={{
                                      backgroundColor: currentColors.primary,
                                      boxShadow: `0 2px 8px ${currentColors.primary}40`
                                    }}
                                    className="w-2 h-2 rounded-full ml-auto"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ancien Section */}
                {groupedNotifications.ancien.length > 0 && (
                  <div>
                    <div
                      style={{
                        backgroundColor: currentColors.sectionBg,
                        borderBottomColor: currentColors.border
                      }}
                      className="sticky top-0 px-6 py-3 border-b z-10">
                      <h6 style={{ color: currentColors.foreground }} className="m-0 font-bold text-sm">
                        Ancien
                      </h6>
                    </div>
                    <div>
                      {groupedNotifications.ancien.map((notif) => (
                        <div
                          key={notif.id}
                          style={{
                            borderBottomColor: currentColors.border,
                            backgroundColor: !notif.read ? currentColors.sectionBg : 'transparent'
                          }}
                          className="px-6 py-4 border-b hover:shadow-sm transition-all relative cursor-pointer"
                        >
                          <div className="flex gap-4 items-start">
                            {/* Avatar placeholder */}
                            <div
                              style={{
                                backgroundColor: currentColors.border,
                                borderColor: currentColors.border
                              }}
                              className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center border">
                              <Bell style={{ color: currentColors.muted }} className="w-6 h-6 opacity-50" />
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Content */}
                              <div
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateFromNotification(notif);
                                }}
                              >
                                <div className="flex justify-between items-start gap-2 mb-1">
                                  <h6 style={{ color: currentColors.foreground }} className="m-0 font-semibold text-sm leading-tight">
                                    {notif.title}
                                  </h6>
                                  <small style={{ color: currentColors.muted }} className="flex-shrink-0 text-xs whitespace-nowrap">
                                    {notif.time}
                                  </small>
                                </div>
                                <p style={{ color: currentColors.muted }} className="m-0 text-xs leading-normal mb-3">
                                  {notif.desc}
                                </p>
                              </div>

                              {/* Action buttons */}
                              <div className="flex gap-2 items-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigateFromNotification(notif);
                                  }}
                                  style={{
                                    backgroundColor: currentColors.primary,
                                    color: currentColors.primaryForeground,
                                    border: `1px solid ${currentColors.primary}`
                                  }}
                                  className="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer hover:opacity-90 transition-all"
                                >
                                  Voir
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Archive action
                                  }}
                                  style={{
                                    backgroundColor: 'transparent',
                                    color: currentColors.muted,
                                    border: `1px solid ${currentColors.border}`
                                  }}
                                  className="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer hover:opacity-90 transition-all"
                                >
                                  Archiver
                                </button>
                                {!notif.read && (
                                  <div
                                    style={{
                                      backgroundColor: currentColors.primary,
                                      boxShadow: `0 2px 8px ${currentColors.primary}40`
                                    }}
                                    className="w-2 h-2 rounded-full ml-auto"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3 py-12">
                <Bell style={{ color: currentColors.muted }} className="w-12 h-12 opacity-20" />
                <small style={{ color: currentColors.muted }} className="text-sm">Aucune notification</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
