import React from 'react';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick, title = 'EcoPilot' }) => (
  <header className="lg:hidden h-14 border-b bg-card flex items-center px-4 gap-3">
    <button
      onClick={onMenuClick}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
    >
      <Menu className="w-5 h-5" />
    </button>
    <span className="text-base font-semibold text-primary">{title}</span>
  </header>
);
