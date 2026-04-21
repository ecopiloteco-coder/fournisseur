import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/providers/AuthContext';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';


export function FournisseurLayout() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMini, setIsMini] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate('/auth', { replace: true });
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.documentElement.setAttribute('data-app-sidebar', isMini ? 'mini' : 'full');
  }, [isMini]);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1191) setIsMini(!isMini);
    else setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`page-layout ${sidebarOpen ? 'layout-sidebar-open' : ''}`}>

      {/* ── Header complet du template (search, thème, notifications, profil, etc.) ── */}
      <Header onToggleSidebar={toggleSidebar} />

      {/* ── Sidebar gauche du template (mêmes boutons/sections) ── */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* ── Main Content ── */}
      <main className="app-wrapper">
        <div className="container">
          <Outlet />
        </div>
      </main>

      {sidebarOpen && (
        <div className="sidebar-mobile-overlay show" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
}
