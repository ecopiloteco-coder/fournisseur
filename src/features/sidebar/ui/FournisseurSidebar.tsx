import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../shared/providers/AuthContext';
import {
  LayoutDashboard, ClipboardList, Send, Activity,
  Package, TrendingUp, Users, Settings, CalendarDays, ListTodo,
  HelpCircle, ChevronLeft, ChevronRight, Building2, LogOut, User,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const FOURNISSEUR_NAV: NavGroup[] = [
  {
    group: 'Tableau de bord',
    items: [
      { label: 'Accueil', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Gestion des Affaires',
    items: [
      { label: 'Demandes de chiffrage', path: '/chiffrage/demandes', icon: <ClipboardList className="w-4 h-4" />, badge: '3' },
      { label: 'Devis envoyés', path: '/chiffrage/devis', icon: <Send className="w-4 h-4" /> },
      { label: 'Suivi des projets', path: '/suivi', icon: <Activity className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Mon Catalogue',
    items: [
      { label: 'Articles', path: '/catalogue/articles', icon: <Package className="w-4 h-4" /> },
      { label: 'Historique des prix', path: '/catalogue/historique', icon: <TrendingUp className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Organisation',
    items: [
      { label: 'Mon équipe', path: '/equipe', icon: <Users className="w-4 h-4" /> },
      { label: 'Paramètres', path: '/settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Outils',
    items: [
      { label: 'Tâches', path: '/task-management', icon: <ListTodo className="w-4 h-4" /> },
      { label: 'Calendrier', path: '/calendar', icon: <CalendarDays className="w-4 h-4" /> },
      { label: 'Aide & FAQ', path: '/pages/faq', icon: <HelpCircle className="w-4 h-4" /> },
    ],
  },
];

// Flat list for MobileMenu
export const FOURNISSEUR_NAV_FLAT = FOURNISSEUR_NAV.flatMap((g) => g.items);

interface FournisseurSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  user: { name: string; email: string };
}

export const FournisseurSidebar: React.FC<FournisseurSidebarProps> = ({
  collapsed, setCollapsed, user,
}) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location.hash === `#${path}` || location.pathname === path;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 hidden lg:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-primary leading-none">EcoPilot</p>
              <p className="text-[10px] text-sidebar-foreground/60">Espace Fournisseur</p>
            </div>
          </div>
        )}
        {collapsed && <Building2 className="w-6 h-6 text-primary mx-auto" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent/20 transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-2">
        {FOURNISSEUR_NAV.map((group) => (
          <div key={group.group} className="mb-2">
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-2 py-1 font-medium">
                {group.group}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative ${
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'hover:bg-sidebar-accent/20 text-sidebar-foreground/80'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="ml-auto bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{user.name}</p>
              <p className="text-[10px] text-sidebar-foreground/60 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-destructive/20 text-destructive/80 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="p-1.5 rounded-lg hover:bg-destructive/20 text-destructive/80 transition-colors mx-auto block"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
