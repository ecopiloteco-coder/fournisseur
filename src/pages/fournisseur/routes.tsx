import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { FournisseurDashboard } from '../../features/dashboard/ui/FournisseurDashboard';
import { DemandesChiffragePage } from '../../features/chiffrage/ui/DemandesChiffragePage';
import { ChiffrageProjetPage } from '../../features/chiffrage/ui/ChiffrageProjetPage';
import { DevisEnvoyesPage } from '../../features/chiffrage/ui/DevisEnvoyesPage';
import CatalogueArticles from '../../features/btp/CatalogueArticles';
import { HistoriquePrixPage } from '../../features/catalogue/ui/HistoriquePrixPage';
import { EquipePage } from '../../features/equipe/ui/EquipePage';
import { MesClientsPage } from '../../features/clients/MesClientsPage';

// Pages utilitaires de l'UI d'origine
import TaskManagement from '../../features/task-management/TaskManagement';
import CalendarPage from '../../features/calendar/CalendarPage';
import Faq from '../../features/pages/Faq';
import Settings from '../../features/settings/Settings';

export const FournisseurRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="/dashboard" replace />} />

      {/* Tableau de bord & BTP */}
      <Route path="/dashboard" element={<FournisseurDashboard />} />
      <Route path="/chiffrage/demandes" element={<DemandesChiffragePage />} />
      <Route path="/chiffrage/:id" element={<ChiffrageProjetPage />} />
      <Route path="/chiffrage/devis" element={<DevisEnvoyesPage />} />
      <Route path="/catalogue/articles" element={<CatalogueArticles />} />
      <Route path="/catalogue/historique" element={<HistoriquePrixPage />} />
      <Route path="/clients" element={<MesClientsPage />} />
      <Route path="/equipe" element={<EquipePage />} />

      {/* Outils & pages annexes (même design que le template) */}
      <Route path="/task-management" element={<TaskManagement />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/pages/faq" element={<Faq />} />
      <Route path="/settings" element={<Settings />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
