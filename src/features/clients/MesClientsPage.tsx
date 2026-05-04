import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../shared/providers/AuthContext';
import { useRealtimeSocket } from '../../shared/providers/RealtimeSocketProvider';
import { fetchClientCompanies, type ClientCompany, getClientCompaniesTotalProjects } from './api/clients.api';

function formatDate(value?: string | null) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('fr-FR').replace(/\//g, ' / ');
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value) || value <= 0) return '-';
  return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

function getProjectStatusLabel(status: string) {
  const value = String(status || '').toLowerCase();
  if (value === 'en_attente') return 'Nouveau';
  if (value === 'en_cours') return 'En cours';
  if (value === 'termine') return 'Terminé';
  if (value === 'expire') return 'Refusé';
  if (value === 'archive') return 'Archivé';
  return status || 'Inconnu';
}

export function MesClientsPage() {
  const { user } = useAuth();
  const { socket } = useRealtimeSocket();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientCompany[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientCompany | null>(null);

  const primaryEntrepriseId = useMemo(
    () => user?.entreprisePublicId || user?.keycloakId || (user?.entrepriseId ? String(user.entrepriseId) : ''),
    [user?.entreprisePublicId, user?.keycloakId, user?.entrepriseId]
  );

  const loadClients = useCallback(async () => {
    if (!primaryEntrepriseId) {
      setLoading(false);
      setError('Impossible de charger les clients sans identification fournisseur.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchClientCompanies(primaryEntrepriseId);
      setClients(data);
    } catch (err) {
      console.error('[MesClients] Error loading clients:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des clients.');
    } finally {
      setLoading(false);
    }
  }, [primaryEntrepriseId]);

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  useEffect(() => {
    if (!socket) return;

    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const refreshWithRetry = () => {
      void loadClients();
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = setTimeout(() => {
        void loadClients();
      }, 1200);
    };

    const handleNotification = (notif: any) => {
      const metadata = notif?.metadata || {};
      const action = notif?.action || metadata?.action;
      const hasProjectHint = Boolean(
        metadata?.projetFournisseurId ||
        metadata?.interneProjetId ||
        metadata?.actionUrl ||
        action === 'NOUVELLE_DEMANDE'
      );

      if (hasProjectHint) {
        refreshWithRetry();
      }
    };

    const handleProjectStatusUpdated = () => {
      refreshWithRetry();
    };

    socket.on('notification', handleNotification);
    socket.on('project-status-updated', handleProjectStatusUpdated);

    return () => {
      socket.off('notification', handleNotification);
      socket.off('project-status-updated', handleProjectStatusUpdated);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [socket, loadClients]);

  const filteredClients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter((client) =>
      client.nom.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.adresse.toLowerCase().includes(query) ||
      client.contactPrincipal.toLowerCase().includes(query) ||
      client.projets.some((project) =>
        project.nomProjet.toLowerCase().includes(query) ||
        String(project.projetId).includes(query)
      )
    );
  }, [clients, searchTerm]);

  const totalProjects = useMemo(() => getClientCompaniesTotalProjects(filteredClients), [filteredClients]);

  return (
    <div className="container-fluid pb-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="text-start mb-3 mb-md-0">
          <h4 className="fw-black text-dark mb-1" style={{ color: '#1B2A4E', fontSize: '20px' }}>Mes client</h4>
          <p className="text-muted small mb-0">Retrouvez les entreprises qui vous envoient des projets et le détail de leurs demandes.</p>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            <i className="fi fi-rr-search position-absolute top-50 translate-middle-y ms-3" style={{ color: '#6Cb2FF' }}></i>
            <input
              type="text"
              className="form-control rounded-pill border-0 shadow-sm ps-5 py-2"
              placeholder="Rechercher"
              style={{ minWidth: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-pill shadow-sm d-flex p-1">
            <button
              className={`btn btn-sm rounded-pill d-flex align-items-center justify-content-center ${viewType === 'grid' ? 'text-white' : 'text-muted'}`}
              style={{ width: '32px', height: '32px', backgroundColor: viewType === 'grid' ? '#6Cb2FF' : 'transparent', border: 'none' }}
              onClick={() => setViewType('grid')}
            >
              <i className="fi fi-rr-apps"></i>
            </button>
            <button
              className={`btn btn-sm rounded-pill d-flex align-items-center justify-content-center ${viewType === 'list' ? 'text-white' : 'text-muted'}`}
              style={{ width: '32px', height: '32px', backgroundColor: viewType === 'list' ? '#6Cb2FF' : 'transparent', border: 'none' }}
              onClick={() => setViewType('list')}
            >
              <i className="fi fi-rr-list"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        <span className="badge text-bg-light border rounded-pill px-3 py-2">Entreprises: {filteredClients.length}</span>
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2">Projets: {totalProjects}</span>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger shadow-sm" role="alert">{error}</div>
      ) : viewType === 'grid' ? (
        <div className="row g-4">
          {filteredClients.map((client) => {
            const latestProject = client.projets[0];
            return (
              <div key={client.id} className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-3 h-100 text-start p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="fw-bold mb-0" style={{ color: '#0978E8' }}>{client.nom}</h6>
                    <span className="badge rounded-pill text-primary bg-primary bg-opacity-10 border border-primary-subtle">
                      {client.projets.length} projet{client.projets.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <p className="small fw-bold text-dark mb-3">
                    {latestProject ? latestProject.nomProjet : 'Aucun projet'}
                  </p>

                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                    <li className="d-flex align-items-center text-muted">
                      <i className="fi fi-rr-user text-primary opacity-50 me-2"></i>
                      {client.nom}
                    </li>
                    <li className="d-flex align-items-center text-muted">
                      <i className="fi fi-rr-envelope text-primary opacity-50 me-2"></i>
                      {client.email}
                    </li>
                    <li className="d-flex align-items-center text-muted">
                      <i className="fi fi-rr-marker text-primary opacity-50 me-2"></i>
                      {client.adresse}
                    </li>
                  </ul>

                  <div className="mt-4 d-flex justify-content-end">
                    <button className="btn btn-sm btn-outline-warning rounded-pill px-3" onClick={() => setSelectedClient(client)}>
                      <i className="fi fi-rr-eye me-1"></i> Consulter
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="table-responsive mt-2">
          <table className="table table-borderless align-middle w-100" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead style={{ backgroundColor: '#6Cb2FF' }}>
              <tr className="small text-white">
                <th className="py-3 px-4 fw-medium text-start bg-transparent border-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Nom d'entreprise</th>
                <th className="py-3 px-4 fw-medium text-start bg-transparent border-0">Email</th>
                <th className="py-3 px-4 fw-medium text-start bg-transparent border-0">Adresse</th>
                <th className="py-3 px-4 fw-medium text-center bg-transparent border-0">Nombre de Projets</th>
                <th className="py-3 px-4 fw-medium text-center bg-transparent border-0" style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="bg-white shadow-sm" style={{ borderRadius: '8px' }}>
                  <td className="py-3 px-4 fw-bold text-dark text-start" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', fontSize: '13px' }}>
                    {client.nom}
                  </td>
                  <td className="py-3 px-4 text-dark fw-semibold text-start" style={{ fontSize: '13px' }}>{client.email}</td>
                  <td className="py-3 px-4 text-dark fw-semibold text-start" style={{ fontSize: '13px' }}>{client.adresse}</td>
                  <td className="py-3 px-4 text-dark fw-bold text-center" style={{ fontSize: '13px' }}>{client.projets.length}</td>
                  <td className="py-3 px-4 text-center" style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                    <button
                      className="btn btn-sm btn-link text-warning p-0"
                      title="Consulter"
                      onClick={() => setSelectedClient(client)}
                    >
                      <i className="fi fi-rr-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && filteredClients.length === 0 && (
        <div className="text-center text-muted py-5">Aucune entreprise trouvée.</div>
      )}

      {selectedClient && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(235, 240, 246, 0.8)' }}></div>
          <div className="modal d-block" tabIndex={-1} role="dialog" onClick={() => setSelectedClient(null)}>
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content border-0 shadow-lg rounded-4 p-4 text-start">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                      {getInitials(selectedClient.nom)}
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1 text-dark">{selectedClient.nom}</h5>
                      <p className="text-muted small mb-0">Projets envoyés à votre entreprise fournisseur</p>
                    </div>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setSelectedClient(null)}></button>
                </div>

                <div className="mb-3">
                  <span className="badge text-bg-light border rounded-pill px-3 py-2">{selectedClient.projets.length} projets</span>
                </div>

                <div className="table-responsive w-100">
                  <table className="table table-borderless align-middle w-100" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                    <thead style={{ backgroundColor: '#6Cb2FF' }}>
                      <tr className="small text-white text-center">
                        <th className="py-2 px-3 fw-medium bg-transparent border-0 text-start" style={{ borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' }}>Projet</th>
                        <th className="py-2 px-3 fw-medium bg-transparent border-0">Statut</th>
                        <th className="py-2 px-3 fw-medium bg-transparent border-0">Articles</th>
                        <th className="py-2 px-3 fw-medium bg-transparent border-0">Date</th>
                        <th className="py-2 px-3 fw-medium bg-transparent border-0" style={{ borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}>Montant HT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedClient.projets.map((project) => (
                        <tr key={project.id} className="bg-white" style={{ borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                          <td className="py-3 px-3 fw-bold text-dark text-start" style={{ fontSize: '12px', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', backgroundColor: '#F8FAFC' }}>
                            <div>{project.nomProjet}</div>
                            <div className="small text-muted">Réf. #{project.projetId}</div>
                          </td>
                          <td className="py-3 px-3 text-center" style={{ backgroundColor: '#F8FAFC' }}>
                            <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle">
                              {getProjectStatusLabel(project.status)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-dark fw-semibold text-center" style={{ fontSize: '12px', backgroundColor: '#F8FAFC' }}>
                            {project.articlesCount}
                          </td>
                          <td className="py-3 px-3 text-dark fw-semibold text-center" style={{ fontSize: '12px', backgroundColor: '#F8FAFC' }}>
                            {formatDate(project.dateRetour || project.deadline || project.dateEnvoi)}
                          </td>
                          <td className="py-3 px-3 text-dark fw-semibold text-center" style={{ fontSize: '12px', backgroundColor: '#F8FAFC', borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}>
                            {formatCurrency(project.amountHt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-end mt-4 pt-2">
                  <button type="button" className="btn btn-outline-primary rounded-pill px-5 py-2 fw-bold" style={{ color: '#6Cb2FF', borderColor: '#A0C6FF' }} onClick={() => setSelectedClient(null)}>
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
