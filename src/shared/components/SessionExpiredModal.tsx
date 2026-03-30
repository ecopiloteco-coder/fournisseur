import React from 'react';
import { LogIn, RefreshCw } from 'lucide-react';

interface SessionExpiredModalProps {
  open: boolean;
  onReconnect: () => void;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ open, onReconnect }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center space-y-5">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Session expirée</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Votre session a expiré. Veuillez vous reconnecter.
          </p>
        </div>
        <button
          onClick={onReconnect}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <LogIn className="w-4 h-4" /> Se reconnecter
        </button>
      </div>
    </div>
  );
};
