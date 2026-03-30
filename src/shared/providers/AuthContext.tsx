// Mapping enum UserRole -> label lisible
const USER_ROLE_LABELS: Record<string, string> = {
  ADMIN_FOURNISSEUR: 'Administrateur Fournisseur',
  CHIFFREUR: 'Chiffreur',
};

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getBackendURL } from '../lib/api-bridge';

export interface FournisseurUser {
  id: number;
  email: string;
  nomEntreprise?: string;
  nomContact?: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  role: 'ADMIN_FOURNISSEUR' | 'CHIFFREUR';
  abonnement?: 'STARTER' | 'PRO' | 'ENTERPRISE' | null;
  entrepriseId?: number;
  keycloakId?: string;
  isActive?: boolean;
}

interface AuthContextType {
  user: FournisseurUser | null;
  token: string | null;
  isLoading: boolean;
  isSessionExpired: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any; requiresPasswordChange?: boolean }>;
  signUp: (data: { 
    email: string; 
    nomEntreprise: string; 
    telephone?: string;
    adresse?: string;
    categorie?: string;
    pack?: string;
    lots?: string[];
  }) => Promise<{ error?: any }>;
  logout: () => void;
  handleSessionExpired: () => void;
  requestPasswordReset: (email: string) => Promise<{ error?: any }>;
  resetPasswordWithCode: (email: string, code: string, pass: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_BUFFER_SECONDS = 60;

function getTokenExpiry(token: string): number | null {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

function buildUserFromResponse(userObj: any): FournisseurUser {
  return {
    ...userObj,
    id: userObj.id,
    email: userObj.email,
    keycloakId: userObj.keycloakId ?? userObj.keycloak_id,
    role: userObj.role === 'CHIFFREUR' ? 'CHIFFREUR' : 'ADMIN_FOURNISSEUR',
    nomEntreprise: userObj.nomEntreprise || userObj.entreprise?.raisonSociale,
    entrepriseId: userObj.entrepriseId || userObj.entreprise?.id,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FournisseurUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const navigate = useNavigate();
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const persistSession = useCallback((accessToken: string, refreshToken: string, userData: FournisseurUser) => {
    setToken(accessToken);
    setUser(userData);
    sessionStorage.setItem('fournisseur_token', accessToken);
    sessionStorage.setItem('fournisseur_refresh', refreshToken);
    sessionStorage.setItem('fournisseur_user', JSON.stringify(userData));
  }, []);

  const clearSession = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    setToken(null);
    setUser(null);
    setIsSessionExpired(false);
    sessionStorage.removeItem('fournisseur_token');
    sessionStorage.removeItem('fournisseur_refresh');
    sessionStorage.removeItem('fournisseur_user');
    sessionStorage.removeItem('requiresPasswordChange');
  }, []);

  const scheduleRefresh = useCallback((accessToken: string) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const expiry = getTokenExpiry(accessToken);
    if (!expiry) return;
    const delay = expiry - Date.now() - REFRESH_BUFFER_SECONDS * 1000;
    if (delay <= 0) { void doRefresh(); return; }
    refreshTimerRef.current = setTimeout(() => void doRefresh(), delay);
  }, []);

  const doRefresh = useCallback(async () => {
    const storedRefreshToken = sessionStorage.getItem('fournisseur_refresh');
    if (!storedRefreshToken) { setIsSessionExpired(true); return; }
    try {
      const response = await fetch(`${getBackendURL()}/api/fournisseurs/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });
      if (!response.ok) { setIsSessionExpired(true); clearSession(); return; }
      const result = await response.json();
      if (result.success) {
        const { token: newToken, refreshToken: newRefreshToken } = result.data;
        const currentUser = JSON.parse(sessionStorage.getItem('fournisseur_user') || 'null');
        sessionStorage.setItem('fournisseur_token', newToken);
        sessionStorage.setItem('fournisseur_refresh', newRefreshToken);
        setToken(newToken);
        scheduleRefresh(newToken);
        if (currentUser) setUser(currentUser);
      } else { setIsSessionExpired(true); clearSession(); }
    } catch { setIsSessionExpired(true); clearSession(); }
  }, [clearSession, scheduleRefresh]);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('fournisseur_user');
    const savedToken = sessionStorage.getItem('fournisseur_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      scheduleRefresh(savedToken);
    }
    setIsLoading(false);
    return () => { if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current); };
  }, [scheduleRefresh]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${getBackendURL()}/api/fournisseurs/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse: password }),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur de connexion au serveur';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          if (response.status === 401) errorMessage = 'Identifiants invalides';
          else if (response.status === 403) errorMessage = 'Compte désactivé ou abonnement requis';
        }
        return { error: { message: errorMessage } };
      }

      const result = await response.json();
      if (result.success) {
        const { token: accessToken, refreshToken, user: userObj, requiresPasswordChange } = result.data;
        const userData = buildUserFromResponse(userObj);
        persistSession(accessToken, refreshToken, userData);
        sessionStorage.setItem('requiresPasswordChange', requiresPasswordChange ? 'true' : 'false');
        scheduleRefresh(accessToken);
        return { error: null, requiresPasswordChange: !!requiresPasswordChange };
      } else {
        return { error: { message: result.message || 'Échec de connexion' } };
      }
    } catch (err: any) {
      return { error: { message: err.message || 'Erreur de connexion' } };
    }
  };

  const signUp = async (data: { 
    email: string; 
    nomEntreprise: string; 
    telephone?: string;
    adresse?: string;
    categorie?: string;
    pack?: string;
    lots?: string[];
  }) => {
    try {
      const response = await fetch(`${getBackendURL()}/api/fournisseurs/entreprises/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          pack: data.pack || 'pack', // Default to 'pack' if not specified
          categorie: data.categorie || 'BTP'
        }),
      });
      
      if (!response.ok) {
        return { error: { message: "Erreur lors de l'inscription" } };
      }

      const result = await response.json();

      const checkoutUrl =
        result?.url ||
        result?.checkoutUrl ||
        result?.data?.url ||
        result?.data?.checkoutUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return { error: null };
      }

      return result?.success ? { error: null } : { error: { message: result?.message || "Erreur lors de l'inscription" } };
    } catch (err: any) {
      return { error: { message: err.message || "Erreur lors de l'inscription" } };
    }
  };

  const logout = () => {
    clearSession();
    navigate('/auth');
  };

  const handleSessionExpired = () => {
    clearSession();
    navigate('/auth');
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const response = await fetch(`${getBackendURL()}/api/fournisseurs/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      return result.success ? { error: null } : { error: { message: result.message } };
    } catch (err: any) {
      return { error: { message: err.message || 'Erreur de connexion' } };
    }
  };

  const resetPasswordWithCode = async (email: string, code: string, pass: string) => {
    try {
      const response = await fetch(`${getBackendURL()}/api/fournisseurs/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: pass }),
      });
      const result = await response.json();
      return result.success ? { error: null } : { error: { message: result.message } };
    } catch (err: any) {
      return { error: { message: err.message || 'Erreur de connexion' } };
    }
  };

  return (
    <AuthContext.Provider value={{
      user, token, isLoading, isSessionExpired,
      signIn, signUp, logout, handleSessionExpired,
      isAuthenticated: !!token,
      isAdmin: !!user && user.role === 'ADMIN_FOURNISSEUR',
      requestPasswordReset, resetPasswordWithCode,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

