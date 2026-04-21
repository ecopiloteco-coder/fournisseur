import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Providers
import { ThemeProvider } from './shared/providers/ThemeContext';
import { LoadingProvider } from './shared/providers/LoadingContext';
import { AuthProvider } from './shared/providers/AuthContext';
import { RealtimeSocketProvider } from './shared/providers/RealtimeSocketProvider';
import { NotificationProvider } from './shared/providers/NotificationProvider';

// Components
import { ErrorBoundary } from './shared/components/ErrorBoundary';



// Pages
import { Auth } from './features/auth/ui/Auth';
import SuccessPage from './pages/auth/SuccessPage';
import { FournisseurLayout } from './pages/fournisseur/FournisseurLayout';
import { FournisseurRoutes } from './pages/fournisseur/routes';
import VitrinePage from './features/vitrine/VitrinePage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LoadingProvider>
            <HashRouter>
                <AuthProvider>
                  <RealtimeSocketProvider>
                    <NotificationProvider>
                    <Suspense
                    fallback={
                      <div className="d-flex align-items-center justify-content-center min-vh-100">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Chargement...</span>
                        </div>
                      </div>
                    }
                  >
                    <Routes>
                      {/* Public Vitrine (site vitrine) */}
                      <Route path="/" element={<VitrinePage />} />

                      {/* Public Auth Route */}
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/fournisseur/success" element={<SuccessPage />} />

                      {/* Protected Supplier Portal */}
                      <Route element={<FournisseurLayout />}>
                        <Route path="/*" element={<FournisseurRoutes />} />
                      </Route>

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/auth" replace />} />
                    </Routes>
                  </Suspense>
                    </NotificationProvider>
                  </RealtimeSocketProvider>
                </AuthProvider>
              </HashRouter>
          </LoadingProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
