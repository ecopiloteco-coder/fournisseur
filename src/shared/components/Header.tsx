import React from 'react';
import { useTheme } from '../providers/ThemeContext';
import { useAuth } from '../providers/AuthContext';
import { Sun, Moon, Bell, Mail, User, Settings, LogOut } from 'lucide-react';
import { MessagingPanel } from './MessagingPanel';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = React.useState(false);
  const [showMessaging, setShowMessaging] = React.useState(false);

  return (
    <>
      <header className="h-14 border-b bg-card flex items-center justify-end px-6 gap-4">
        {/* Messaging */}
        <button 
          onClick={() => setShowMessaging(true)}
          className="relative p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          type="button"
        >
          <Mail className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-none">{user?.nomContact || 'Fournisseur'}</p>
              <p className="text-xs text-muted-foreground">{user?.nomEntreprise}</p>
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-card border rounded-lg shadow-lg py-1 z-50">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2">
                <User className="w-4 h-4" /> Mon profil
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2">
                <Settings className="w-4 h-4" /> Paramètres
              </button>
              <hr className="my-1 border-border" />
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 text-destructive"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Messaging Panel */}
      <MessagingPanel isOpen={showMessaging} onClose={() => setShowMessaging(false)} />
    </>
  );
};
