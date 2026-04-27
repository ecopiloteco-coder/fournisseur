import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Layers3,
  Search,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../../shared/providers/AuthContext';
import { useRealtimeSocket } from '../../../shared/providers/RealtimeSocketProvider';
import {
  fetchDemandesParEntreprise,
  refuserProjet,
  updateProjetStatus,
  type ProjetFournisseurResponse,
} from '../api/chiffrage.api';
import { toast } from 'sonner';

type SupplierProjectStatus = 'en_attente' | 'en_cours' | 'termine' | 'expire' | 'archive' | 'inconnu';

type SupplierProjectRow = {
  id: number;
  projetId: number;
  publicId: string;
  name: string;
  clientName: string;
  articlesCount: number;
  amountHt: number;
  startDate: string | null;
  endDate: string | null;
  returnDate: string | null;
  status: SupplierProjectStatus;
  raw: ProjetFournisseurResponse;
};

const statusMeta: Record<SupplierProjectStatus, { label: string; badge: string; icon: string; timelineIndex: number }> = {
  en_attente: {
    label: 'Nouveau',
    badge: 'bg-warning-subtle text-warning border border-warning-subtle',
    icon: 'fi-rr-hourglass-start',
    timelineIndex: 1,
  },
  en_cours: {
    label: 'En cours',
    badge: 'bg-primary-subtle text-primary border border-primary-subtle',
    icon: 'fi-rr-time-fast',
    timelineIndex: 2,
  },
  termine: {
    label: 'Terminé',
    badge: 'bg-success-subtle text-success border border-success-subtle',
    icon: 'fi-rr-check',
    timelineIndex: 5,
  },
  expire: {
    label: 'Expiré',
    badge: 'bg-danger-subtle text-danger border border-danger-subtle',
    icon: 'fi-rr-cross-circle',
    timelineIndex: 4,
  },
  archive: {
    label: 'Archivé',
    badge: 'bg-secondary-subtle text-secondary border border-secondary-subtle',
    icon: 'fi-rr-box',
    timelineIndex: 5,
  },
  inconnu: {
    label: 'Inconnu',
    badge: 'bg-light text-muted border border-light',
    icon: 'fi-rr-interrogation',
    timelineIndex: 0,
  },
};

const followSteps = [
  { label: 'Reçu', desc: 'Le projet est arrivé dans votre suivi.' },
  { label: 'En attente', desc: 'Le dossier attend une prise en charge.' },
  { label: 'En cours', desc: 'Le devis est en cours de préparation.' },
  { label: 'Devis envoyé', desc: 'Le chiffrage a été transmis au client.' },
  { label: 'Réponse', desc: 'Le projet attend une validation finale.' },
  { label: 'Clôturé', desc: 'Le projet est terminé, expiré ou archivé.' },
];

function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('fr-FR');
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value) || value <= 0) return '-';
  return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

function normalizeStatus(rawStatus: unknown): SupplierProjectStatus {
  const value = String(rawStatus || '').toLowerCase().replace(/\s+/g, '_');
  if (value.includes('attente') || value.includes('nouveau')) return 'en_attente';
  if (value.includes('cours')) return 'en_cours';
  if (value.includes('termin')) return 'termine';
  if (value.includes('expir')) return 'expire';
  if (value.includes('archiv')) return 'archive';
  return 'inconnu';
}

function getClientName(project: any) {
  return (
    project?.clientData?.nomClient ||
    project?.clientName ||
    project?.contactName ||
    project?.nomContact ||
    project?.responsable ||
    project?.fournisseurNom ||
    'Client'
  );
}

function getArticlesCount(project: any) {
  const lots = Array.isArray(project?.lots) ? project.lots : [];
  const fromLots = lots.reduce((sum: number, lot: any) => sum + (Array.isArray(lot?.articles) ? lot.articles.length : 0), 0);
  if (fromLots > 0) return fromLots;
  return Number(project?.articlesCount || project?.articleCount || 0);
}

function getAmountHt(project: any) {
  const direct = Number(project?.prixTotal ?? project?.amountHt ?? 0);
  if (direct > 0) return direct;
  const fromLots = Array.isArray(project?.lots)
    ? project.lots.reduce((sum: number, lot: any) => sum + Number(lot?.prixTotal || 0), 0)
    : 0;
  if (fromLots > 0) return fromLots;
  return Number(project?.prixVente || 0);
}

function mapProject(project: ProjetFournisseurResponse): SupplierProjectRow {
  return {
    id: project.id,
    projetId: project.projetId,
    publicId: project.publicId,
    name: project.nomProjet || `Projet ${project.projetId || project.id}`,
    clientName: getClientName(project),
    articlesCount: getArticlesCount(project),
    amountHt: getAmountHt(project),
    startDate: (project as any)?.dateEnvoi || (project as any)?.createdAt || null,
    endDate: project.deadline || null,
    returnDate: project.dateRetour || null,
    status: normalizeStatus(project.status),
    raw: project,
  };
}

export function DevisEnvoyesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useRealtimeSocket();

  const [projects, setProjects] = useState<SupplierProjectRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<SupplierProjectRow | null>(null);
  const [actionType, setActionType] = useState<'accepter' | 'refuser' | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [motifRefus, setMotifRefus] = useState('');
  const [descriptionRefus, setDescriptionRefus] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  const userEntreprise = user?.entreprisePublicId || user?.keycloakId || (user?.entrepriseId ? String(user.entrepriseId) : '');

  const loadProjects = useCallback(async () => {
    if (!userEntreprise) {
      setIsLoading(false);
      setError('Impossible de charger les projets sans identification fournisseur.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchDemandesParEntreprise(userEntreprise);
      setProjects(data.map(mapProject));
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du chargement des projets.');
    } finally {
      setIsLoading(false);
    }
  }, [userEntreprise]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (!socket) return;

    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    const refreshWithRetry = () => {
      void loadProjects();
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = setTimeout(() => {
        void loadProjects();
      }, 1200);
    };

    const handleProjectStatusUpdated = () => {
      refreshWithRetry();
    };

    const handleNotification = (notif: any) => {
      const metadata = notif?.metadata || {};
      const hasProjectHint = Boolean(
        metadata?.projetFournisseurId || metadata?.interneProjetId || metadata?.actionUrl
      );
      if (hasProjectHint) {
        refreshWithRetry();
      }
    };

    socket.on('project-status-updated', handleProjectStatusUpdated);
    socket.on('notification', handleNotification);

    return () => {
      socket.off('project-status-updated', handleProjectStatusUpdated);
      socket.off('notification', handleNotification);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [socket, loadProjects]);

  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) => (
      project.name.toLowerCase().includes(query)
      || project.clientName.toLowerCase().includes(query)
      || String(project.id).includes(query)
      || String(project.projetId).includes(query)
    ));
  }, [projects, searchTerm]);

  const openActionModal = (project: SupplierProjectRow, type: 'accepter' | 'refuser') => {
    setSelectedProject(project);
    setActionType(type);
    setShowActionModal(true);
    setMotifRefus('');
    setDescriptionRefus('');
  };

  const openFollowModal = (project: SupplierProjectRow) => {
    setSelectedProject(project);
    setShowFollowModal(true);
  };

  const closeAllModals = () => {
    setShowActionModal(false);
    setShowFollowModal(false);
    setSelectedProject(null);
    setActionType(null);
    setMotifRefus('');
    setDescriptionRefus('');
  };

  const handleConsult = (project: SupplierProjectRow) => {
    navigate(`/chiffrage/${project.id}`);
  };

  const handleActionSubmit = async () => {
    if (!selectedProject || !actionType) return;
    if (actionType === 'refuser' && !motifRefus.trim()) {
      toast.error('Veuillez sélectionner un motif de refus.');
      return;
    }

    try {
      setProcessingAction(true);
      if (actionType === 'accepter') {
        await updateProjetStatus(selectedProject.id, { status: 'en_cours' });
        toast.success('Projet accepté avec succès.');
      } else {
        await refuserProjet(selectedProject.id, {
          motifRefus,
          descriptionRefus,
        });
        toast.success('Projet refusé avec succès.');
      }
      closeAllModals();
      await loadProjects();
    } catch (err: any) {
      toast.error(err?.message || 'Une erreur est survenue.');
    } finally {
      setProcessingAction(false);
    }
  };

  const projectStatus = selectedProject ? statusMeta[selectedProject.status] : statusMeta.inconnu;
  const currentTimelineIndex = selectedProject ? projectStatus.timelineIndex : 0;

  return (
    <div className="text-start">
      <div className="app-page-head d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="app-page-title">Suivi de Projet</h1>
          <p className="text-muted small mb-0">Liste de tous vos projets avec suivi, statuts et actions rapides.</p>
        </div>
        <button className="btn btn-white border shadow-sm btn-sm px-3" type="button" onClick={() => void loadProjects()}>
          <i className="fi fi-rr-refresh me-1"></i> Actualiser
        </button>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3 align-items-center">
            <div className="col-lg-6">
              <div className="position-relative">
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
                <input
                  type="text"
                  className="form-control form-control-sm ps-5 bg-light border-light rounded-pill shadow-none"
                  placeholder="Rechercher un projet, client ou référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-6 text-lg-end">
              <span className="badge text-bg-light border rounded-pill px-3 py-2 me-2">Total: {filteredProjects.length}</span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2">Projets réels</span>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger shadow-sm" role="alert">
          <i className="fi fi-rr-cross-circle me-2"></i>{error}
        </div>
      ) : (
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive text-start">
            <table className="table table-hover align-middle mb-0">
              <thead className="border-0">
                <tr className="small text-uppercase border-0" style={{ letterSpacing: '0.5px' }}>
                  <th className="px-4 py-3 text-white fw-bold" style={{ backgroundColor: '#0978E8', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Projet</th>
                  <th className="py-3 text-white fw-bold" style={{ backgroundColor: '#0978E8' }}>Client</th>
                  <th className="py-3 text-white fw-bold" style={{ backgroundColor: '#0978E8' }}>Articles</th>
                  <th className="py-3 text-white fw-bold" style={{ backgroundColor: '#0978E8' }}>Montant HT</th>
                  <th className="py-3 text-white fw-bold" style={{ backgroundColor: '#0978E8' }}>Date début</th>
                  <th className="py-3 text-white fw-bold" style={{ backgroundColor: '#0978E8' }}>Date fin</th>
                  <th className="py-3 text-white fw-bold" style={{ backgroundColor: '#0978E8' }}>Retour devis</th>
                  <th className="py-3 text-white fw-bold" style={{ backgroundColor: '#0978E8' }}>Statut</th>
                  <th className="px-4 py-3 text-end text-white fw-bold" style={{ backgroundColor: '#0978E8', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => {
                  const meta = statusMeta[project.status] || statusMeta.inconnu;
                  const canReview = project.status === 'en_attente';
                  const canConsult = project.status === 'en_cours' || project.status === 'termine' || project.status === 'expire' || project.status === 'archive';
                  return (
                    <tr key={project.id} className="align-middle">
                      <td className="px-4 py-3">
                        <div className="fw-bold text-dark">{project.name}</div>
                        <div className="small text-muted">
                          Réf. <span className="text-primary fw-semibold">#{project.projetId || project.id}</span>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{project.clientName}</div>
                      </td>
                      <td>
                        <span className="d-inline-flex align-items-center gap-2 fw-bold text-dark">
                          <Layers3 size={16} className="text-primary" />
                          {project.articlesCount}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-dark">{formatCurrency(project.amountHt)}</span>
                      </td>
                      <td>
                        <span className="small fw-semibold text-muted">
                          <CalendarDays size={14} className="me-1 text-primary" />
                          {formatDate(project.startDate)}
                        </span>
                      </td>
                      <td>
                        <span className="small fw-semibold text-muted">{formatDate(project.endDate)}</span>
                      </td>
                      <td>
                        <span className="small fw-semibold text-muted">{formatDate(project.returnDate)}</span>
                      </td>
                      <td>
                        <span className={`badge px-3 py-2 rounded-pill ${meta.badge}`}>
                          <i className={`fi ${meta.icon} me-1`}></i>{meta.label}
                        </span>
                      </td>
                      <td className="px-4 text-end">
                        <div className="d-inline-flex align-items-center gap-2 flex-wrap justify-content-end">
                          {canReview ? (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success rounded-pill px-3 fw-semibold shadow-sm"
                                onClick={() => openActionModal(project, 'accepter')}
                                title="Accepter"
                              >
                                <CheckCircle2 size={16} className="me-1" /> Accepter
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold"
                                onClick={() => openActionModal(project, 'refuser')}
                                title="Refuser"
                              >
                                <XCircle size={16} className="me-1" /> Refuser
                              </button>
                            </>
                          ) : (
                            canConsult && (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold shadow-sm"
                                onClick={() => handleConsult(project)}
                                title="Consulter le projet"
                              >
                                <Eye size={16} className="me-1" /> Consulter
                              </button>
                            )
                          )}
                          <button
                            type="button"
                            className="btn btn-sm btn-light border rounded-pill px-3 fw-semibold"
                            onClick={() => openFollowModal(project)}
                            title="Suivi du projet"
                          >
                            <Clock3 size={16} className="me-1 text-primary" /> Suivi
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="p-5 text-center text-muted">
              <div className="mb-2"><i className="fi fi-rr-inbox" style={{ fontSize: '24px' }}></i></div>
              Aucun projet trouvé.
            </div>
          )}
        </div>
      )}

      {showActionModal && selectedProject && actionType && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 9001 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '560px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className={`modal-header border-0 px-4 py-3 ${actionType === 'accepter' ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                <div>
                  <h5 className="modal-title fw-bold mb-1">
                    {actionType === 'accepter' ? 'Accepter le projet' : 'Refuser le projet'}
                  </h5>
                  <p className="text-muted small mb-0">{selectedProject.name}</p>
                </div>
                <button type="button" className="btn-close" onClick={closeAllModals}></button>
              </div>

              <div className="modal-body p-4 text-start">
                <div className="rounded-4 border p-3 bg-light mb-3">
                  <div className="row g-2 small text-muted">
                    <div className="col-6"><strong className="text-dark">Client:</strong> {selectedProject.clientName}</div>
                    <div className="col-6"><strong className="text-dark">Montant HT:</strong> {formatCurrency(selectedProject.amountHt)}</div>
                    <div className="col-6"><strong className="text-dark">Début:</strong> {formatDate(selectedProject.startDate)}</div>
                    <div className="col-6"><strong className="text-dark">Fin:</strong> {formatDate(selectedProject.endDate)}</div>
                  </div>
                </div>

                {actionType === 'refuser' ? (
                  <>
                    <label className="form-label small fw-bold text-dark">Motif de refus</label>
                    <select
                      className="form-select border-light bg-light rounded-3 shadow-none mb-3"
                      value={motifRefus}
                      onChange={(e) => setMotifRefus(e.target.value)}
                    >
                      <option value="">Sélectionnez un motif</option>
                      <option value="prix_trop_eleve">Prix trop élevé</option>
                      <option value="delai_incompatible">Délai incompatible</option>
                      <option value="dossier_incomplet">Dossier incomplet</option>
                      <option value="qualite_non_conforme">Qualité non conforme</option>
                      <option value="autre">Autre</option>
                    </select>

                    <label className="form-label small fw-bold text-dark">Description complémentaire</label>
                    <textarea
                      className="form-control border-light bg-light rounded-3 shadow-none"
                      rows={4}
                      placeholder="Ajoutez un commentaire si nécessaire..."
                      value={descriptionRefus}
                      onChange={(e) => setDescriptionRefus(e.target.value)}
                    />
                  </>
                ) : (
                  <div className="alert alert-success border-0 mb-0">
                    <strong>Confirmer l'acceptation</strong>
                    <div className="small mt-1">Le projet passera en cours et apparaîtra dans votre suivi actif.</div>
                  </div>
                )}
              </div>

              <div className="modal-footer border-0 p-4 bg-light bg-opacity-50">
                <button className="btn btn-white border rounded-pill px-4" onClick={closeAllModals} disabled={processingAction} type="button">
                  Annuler
                </button>
                <button
                  className={`btn rounded-pill px-4 fw-bold shadow-sm ${actionType === 'accepter' ? 'btn-success' : 'btn-danger'}`}
                  onClick={handleActionSubmit}
                  disabled={processingAction}
                  type="button"
                >
                  {processingAction ? 'Traitement...' : actionType === 'accepter' ? 'Confirmer l’acceptation' : 'Confirmer le refus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFollowModal && selectedProject && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 9001 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '620px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 px-4 py-3 bg-primary-subtle">
                <div>
                  <h5 className="modal-title fw-bold mb-1">Suivi du projet</h5>
                  <p className="text-muted small mb-0">{selectedProject.name}</p>
                </div>
                <button type="button" className="btn-close" onClick={closeAllModals}></button>
              </div>

              <div className="modal-body p-4 text-start">
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="p-3 rounded-4 border bg-light h-100">
                      <div className="small text-muted mb-1">Client</div>
                      <div className="fw-semibold text-dark">{selectedProject.clientName}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded-4 border bg-light h-100">
                      <div className="small text-muted mb-1">Statut</div>
                      <span className={`badge px-3 py-2 rounded-pill ${projectStatus.badge}`}>
                        <i className={`fi ${projectStatus.icon} me-1`}></i>{projectStatus.label}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 rounded-4 border bg-light h-100">
                      <div className="small text-muted mb-1">Date début</div>
                      <div className="fw-semibold text-dark">{formatDate(selectedProject.startDate)}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 rounded-4 border bg-light h-100">
                      <div className="small text-muted mb-1">Date fin</div>
                      <div className="fw-semibold text-dark">{formatDate(selectedProject.endDate)}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 rounded-4 border bg-light h-100">
                      <div className="small text-muted mb-1">Retour devis</div>
                      <div className="fw-semibold text-dark">{formatDate(selectedProject.returnDate)}</div>
                    </div>
                  </div>
                </div>

                <div className="position-relative ps-4">
                  {followSteps.map((step, idx) => {
                    const isDone = idx < currentTimelineIndex;
                    const isActive = idx === currentTimelineIndex;
                    const dotClass = isDone ? 'bg-success' : isActive ? 'bg-primary' : 'bg-light';
                    const titleClass = isDone || isActive ? 'text-dark' : 'text-muted';
                    return (
                      <div key={step.label} className="position-relative mb-4">
                        {idx < followSteps.length - 1 && (
                          <div className="position-absolute start-0 top-4 bottom-0 border-start border-dashed border-2 border-secondary-subtle" style={{ marginLeft: '-13px', marginTop: '32px' }} />
                        )}
                        <div className="d-flex gap-3 align-items-start">
                          <div className={`rounded-circle ${dotClass}`} style={{ width: 30, height: 30, minWidth: 30, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
                          <div>
                            <h6 className={`mb-1 fw-bold ${titleClass}`}>{step.label}</h6>
                            <p className="text-muted small mb-0">{step.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="modal-footer border-0 p-4 bg-light bg-opacity-50">
                <button className="btn btn-outline-primary rounded-pill px-4 fw-semibold" onClick={() => handleConsult(selectedProject)} type="button">
                  <ArrowUpRight size={16} className="me-1" /> Ouvrir le projet
                </button>
                <button className="btn btn-white border rounded-pill px-4" onClick={closeAllModals} type="button">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .bg-warning-subtle { background-color: #fff4db !important; }
        .bg-primary-subtle { background-color: #eaf0ff !important; }
        .bg-success-subtle { background-color: #e7f8f1 !important; }
        .bg-danger-subtle { background-color: #feecec !important; }
        .bg-secondary-subtle { background-color: #f3f4f6 !important; }
        .border-warning-subtle { border-color: #f7d38a !important; }
        .border-primary-subtle { border-color: #c4d2ff !important; }
        .border-success-subtle { border-color: #b6ead6 !important; }
        .border-danger-subtle { border-color: #f6b8b8 !important; }
        .table > :not(caption) > * > * { vertical-align: middle; }
      `}</style>
    </div>
  );
}