import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/providers/AuthContext';
import { fetchDemandeById, chiffrerArticle, soumettreDevis, ProjetFournisseurResponse, uploadArticleFichier, signalerArticle, refuserProjet, updateProjetStatus } from '../api/chiffrage.api';
import { getBackendURL, getNotificationBackendURL } from '../../../shared/lib/api-bridge';
import { useRealtimeSocket } from '../../../shared/providers/RealtimeSocketProvider';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import AddArticleModal from '../../btp/AddArticleModal';
import { createArticleComplet, fetchArticlesFournisseur } from '../../btp/articleFournisseurService';

function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.03;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
  }
}

function getConnectedUserUUID() {
  try {
    const user = JSON.parse(sessionStorage.getItem('fournisseur_user') || '{}')
    return user.keycloakId || null
  } catch {
    return null
  }
}

export function ChiffrageProjetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useRealtimeSocket();
  
  const [projet, setProjet] = useState<ProjetFournisseurResponse | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMissing, setFilterMissing] = useState(false);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<number | null>(null);
  const [globalTva, setGlobalTva] = useState(20);
  const [remiseFlashId, setRemiseFlashId] = useState<number | null>(null);
  
  // Signalement state
  const [isSignaling, setIsSignaling] = useState(false);
  const [signalModal, setSignalModal] = useState<{ isOpen: boolean; targetId?: number; type?: 'article' | 'projet' }>({ isOpen: false });
  const [signalMotif, setSignalMotif] = useState('');
  const [signalDescription, setSignalDescription] = useState('');
  
  // Timeline Modal
  const [timelineModal, setTimelineModal] = useState<{ isOpen: boolean; article?: any }>({ isOpen: false });
  
  // Library Modal
  const [libraryModal, setLibraryModal] = useState<{ isOpen: boolean; article?: any }>({ isOpen: false });
  const [libraryFormData, setLibraryFormData] = useState({
    lot: '',
    ref: '',
    nom: '',
    date: '',
    prixUnitaire: '',
    unite: '',
    decompose: false,
    fourniture: '',
    accessoires: '',
    pose: '',
    cadence: '',
    coefficient: ''
  });

  // Associate Modal
  const [associateModal, setAssociateModal] = useState<{ isOpen: boolean; article?: any }>({ isOpen: false });
  const [associateSearch, setAssociateSearch] = useState('');
  const [associateLot, setAssociateLot] = useState('');
  const [associateArticles, setAssociateArticles] = useState<any[]>([]);
  const [associateLoading, setAssociateLoading] = useState(false);
  const [associatePage, setAssociatePage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Unpriced Warning Modal
  const [unpricedWarningModal, setUnpricedWarningModal] = useState(false);
  
  // Chat
  const [chatMessages, setChatMessages] = useState<{ id: string | number; from: 'fournisseur' | 'projet'; message: string; time: string; senderName?: string }[]>([]);
  const [chatDraft, setChatDraft] = useState('');
  const [chatSender, setChatSender] = useState<'fournisseur' | 'projet'>('fournisseur');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const roomId = id ? `projet-fournisseur_${id}` : '';

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await fetchDemandeById(Number(id));
        setProjet(data);
        const allArticles = data.lots?.flatMap(lot => 
          lot.articles.map(a => {
            const hasPrice = Number(a.prixUnitaire) > 0;
            const price = hasPrice ? Number(a.prixUnitaire) : '';
            const rabaisPercent = Number(a.rabais || 0);
            const remise = hasPrice
              ? Number((Number(price) * (1 - rabaisPercent / 100)).toFixed(2))
              : '';
            const backendFiles = (a.fichiers || []).map((f: any) => ({
              name: f.nomFichier,
              size: `${(Number(f.taille || 0) / 1024).toFixed(0)} KB`,
              url: f.url,
            }));

            return {
              id: a.id,
              code: `REF-${a.projetArticleId || a.articleId || a.id}`,
              label: a.description,
              detailsDescription: a.remarque || a.description,
              unit: a.unite || 'U',
              qty: a.quantite || 0,
              price,
              remise,
              tva: Number(a.tva || 20),
              files: backendFiles,
              catalogPrice: 0,
              statusInterne: a.status,
              motifSignalement: a.motifSignalement,
              descriptionSignalement: a.descriptionSignalement,
              motifRefusInterne: a.motifRefusInterne,
              descriptionRefusInterne: a.descriptionRefusInterne,
              dateChiffrage: a.dateChiffrage
            };
          })
        ) || [];
        setArticles(allArticles);
        if (allArticles.length > 0) {
          const firstTva = Number(allArticles[0]?.tva);
          setGlobalTva(Number.isFinite(firstTva) ? firstTva : 20);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  useEffect(() => {
    if (!id || !user) return;
    
    const token = sessionStorage.getItem('fournisseur_token');
    
    const loadHistory = async () => {
      try {
        const res = await fetch(`${getNotificationBackendURL()}/api/chat/${roomId}/messages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setChatMessages(data.data.map((m: any) => ({
              id: m._id,
              from: m.senderType === 'FOURNISSEUR' ? 'fournisseur' : 'projet',
              message: m.message,
              time: new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              senderName: m.senderName
            })));
          }
        }
      } catch (err) {}
    };
    loadHistory();

    const handleChatMessage = (m: any) => {
      setChatMessages(prev => [...prev, {
        id: m._id || Date.now(),
        from: m.senderType === 'FOURNISSEUR' ? 'fournisseur' : 'projet',
        message: m.message,
        time: new Date(m.createdAt || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        senderName: m.senderName
      }]);
      if (m.senderType !== 'FOURNISSEUR') {
        playNotificationSound();
      }
    };

    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const refreshProject = async () => {
      try {
        const refreshed = await fetchDemandeById(Number(id));
        setProjet(refreshed);
      } catch {
      }
    };

    const refreshProjectWithRetry = () => {
      void refreshProject();
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = setTimeout(() => {
        void refreshProject();
      }, 1200);
    };

    const handleProjectStatusUpdated = (evt: any) => {
      const updatedProjectId = Number(evt?.projetFournisseurId);
      if (!Number.isFinite(updatedProjectId) || updatedProjectId !== Number(id)) return;
      refreshProjectWithRetry();
    };

    const handleNotification = (notif: any) => {
      const metadata = notif?.metadata || {};
      const notifProjectId = Number(metadata?.projetFournisseurId);
      const actionUrl = String(metadata?.actionUrl || '');
      const linkedByProjectId = Number.isFinite(notifProjectId) && notifProjectId === Number(id);
      const linkedByPath = actionUrl.includes(`/chiffrage/${id}`);
      if (!linkedByProjectId && !linkedByPath) {
        return;
      }
      refreshProjectWithRetry();
    };

    socket?.emit('join-room', roomId);
    socket?.on('chat-message', handleChatMessage);
    socket?.on('project-status-updated', handleProjectStatusUpdated);
    socket?.on('notification', handleNotification);

    return () => {
      socket?.off('chat-message', handleChatMessage);
      socket?.off('project-status-updated', handleProjectStatusUpdated);
      socket?.off('notification', handleNotification);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [id, user, roomId, socket]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handlePriceChange = (artId: number, value: string) => {
    setArticles(a => a.map((art) => {
      if (art.id !== artId) return art;

      if (value.trim() === '') {
        return {
          ...art,
          price: '',
          remise: '',
          statusInterne: 'en_attente_chiffrage'
        };
      }

      const nextPrice = Number(value);

      return {
        ...art,
        price: nextPrice,
        // Keep remise synchronized with price when price is typed.
        remise: nextPrice,
        statusInterne: 'chiffre'
      };
    }));

    setRemiseFlashId(artId);
    window.setTimeout(() => {
      setRemiseFlashId((current) => (current === artId ? null : current));
    }, 520);
  };

  const handleRemiseChange = (artId: number, value: string) => {
    setArticles(a => a.map((art) => {
      if (art.id !== artId) return art;
      if (!(typeof art.price === 'number' && art.price > 0)) return art;
      if (value.trim() === '') return { ...art, remise: '' };
      const numericValue = Number(value);
      return { ...art, remise: Math.max(0, Math.min(numericValue, art.price)) };
    }));
  };

  const handleGlobalTvaChange = (value: string) => {
    const numericValue = value.trim() === '' ? 0 : Number(value);
    const nextTva = Math.max(0, Math.min(100, Number.isFinite(numericValue) ? numericValue : 0));
    setGlobalTva(nextTva);
    setArticles((prev) => prev.map((art) => ({ ...art, tva: nextTva })));
  };

  const getArticleTotalHT = (article: any) => {
    const qty = Number(article.qty || 0);
    if (typeof article.remise === 'number' && article.remise > 0) {
      return qty * article.remise;
    }
    if (typeof article.price === 'number' && article.price > 0) {
      return qty * article.price;
    }
    return 0;
  };

  const applyCatalogPrice = (artId: number, catalogPrice: number) => handlePriceChange(artId, String(catalogPrice));

  const isArticlePending = (a: any) => a.statusInterne === 'en_attente_chiffrage' || a.statusInterne === 'Non chiffré' || a.statusInterne === 'Non chiffre';

  // ── Associate Modal Logic ──────────────────────────────────────────────────────
  
  useEffect(() => {
    if (!associateModal.isOpen) return;
    setAssociateLoading(true);
    setAssociatePage(1);
    fetchArticlesFournisseur()
      .then(data => {
        if (!Array.isArray(data)) {
          setAssociateArticles([]);
          return;
        }
        // Enrichir chaque article avec le dernier prix
        const articlesWithPrix = data.map(a => {
          const activePrix = a.prix?.find((p: any) => p.isActive) ?? a.prix?.[0] ?? null;
          return {
            ...a,
            pu: activePrix?.prixUnitaire ?? 0,
            lastPrixDate: activePrix?.dateDebut ?? null,
          };
        });
        setAssociateArticles(articlesWithPrix);
      })
      .catch(err => {
        console.error('Erreur lors du chargement des articles:', err);
        setAssociateArticles([]);
      })
      .finally(() => setAssociateLoading(false));
  }, [associateModal.isOpen]);

  const filteredAssociateArticles = useMemo(() => {
    return associateArticles.filter(a => {
      const matchesSearch = !associateSearch || 
        a.nomArticle?.toLowerCase().includes(associateSearch.toLowerCase()) ||
        a.refArticle?.toLowerCase().includes(associateSearch.toLowerCase());
      const matchesLot = !associateLot || a.lot === associateLot;
      return matchesSearch && matchesLot;
    });
  }, [associateArticles, associateSearch, associateLot]);

  const totalAssociatePages = Math.ceil(filteredAssociateArticles.length / ITEMS_PER_PAGE);
  const paginatedAssociateArticles = useMemo(() => {
    const start = (associatePage - 1) * ITEMS_PER_PAGE;
    return filteredAssociateArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAssociateArticles, associatePage]);

  const uniqueLots = useMemo(() => {
    const lots = [...new Set(associateArticles.map(a => a.lot).filter(Boolean))];
    return lots.sort();
  }, [associateArticles]);

  const handleAssociateArticle = (article: any) => {
    const articleId = associateModal.article?.id;
    if (articleId && article.pu) {
      setArticles(a => a.map(art => 
        art.id === articleId ? { ...art, price: Number(article.pu), remise: Number(article.pu), statusInterne: 'chiffre' } : art
      ));
      toast.success(`Prix ${article.pu}€ appliqué avec succès`);
    }
    setAssociateModal({ isOpen: false });
  };

  const filteredArticles = useMemo(() => articles.filter(a => {
    const matchesSearch = a.label.toLowerCase().includes(searchTerm.toLowerCase()) || a.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (filterMissing ? isArticlePending(a) : true);
  }), [articles, searchTerm, filterMissing]);

  const totalHT = useMemo(() => articles.reduce((sum, a) => sum + getArticleTotalHT(a), 0), [articles]);
  const totalTVA = useMemo(() => articles.reduce((sum, a) => sum + (getArticleTotalHT(a) * (Number(a.tva || 0) / 100)), 0), [articles]);
  const totalTTC = useMemo(() => totalHT + totalTVA, [totalHT, totalTVA]);
  const missingCount = articles.filter(a => isArticlePending(a)).length;
  const completionRate = articles.length > 0 ? ((articles.length - missingCount) / articles.length * 100).toFixed(0) : '0';
  const isTermine = projet?.status === 'termine';
  const isExpired = projet?.status === 'expire';
  const isNouveau = projet?.status === 'en_attente';
  const isLocked = isTermine || isExpired;
  const chatWritable = projet?.status === 'en_cours';
  const chatReadOnly = projet?.status === 'expire' || projet?.status === 'termine';
  const showChat = chatWritable || chatReadOnly;
  const showStatusAndActionColumns = !isNouveau;

  const handleSave = async () => {
    if (!projet) return;
    setIsSaving(true);
    try {
      for (const a of articles) {
        if (typeof a.price === 'number' && a.price > 0) {
          const effectiveRemise = typeof a.remise === 'number' ? a.remise : a.price;
          const rabaisPercent = a.price > 0
            ? Math.max(0, Math.min(100, ((a.price - effectiveRemise) / a.price) * 100))
            : 0;

          await chiffrerArticle(a.id, {
            prixUnitaire: a.price,
            tva: Number(a.tva || 0),
            rabais: Number(rabaisPercent.toFixed(2)),
            remarque: ''
          });
        }
      }
      // Re-fetch to get updated server-side calculations
      const data = await fetchDemandeById(Number(id));
      setProjet(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitDevis = async () => {
    if (!projet || !user) return;
    if (missingCount > 0) {
      setUnpricedWarningModal(true);
      return;
    }
    try {
      await handleSave();
      
      const token = sessionStorage.getItem('fournisseur_token');
      let realName = user.nomEntreprise || 'Fournisseur';
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          if (decoded.name) realName = decoded.name;
          else if (decoded.given_name) realName = `${decoded.given_name} ${decoded.family_name || ''}`.trim();
        } catch (e) {}
      }
      const userId = user.keycloakId || String(user.entrepriseId);
      
      await soumettreDevis(projet.id, user.nomEntreprise || 'Fournisseur', userId, realName, totalHT);
      toast.success('Devis envoyé avec succès ! 📄');
      navigate('/chiffrage/devis');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAcceptProject = async () => {
    if (!projet) return;
    setIsSaving(true);
    try {
      await updateProjetStatus(projet.id, { status: 'en_cours' });
      const refreshed = await fetchDemandeById(Number(id));
      setProjet(refreshed);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (articleId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploading(articleId);
    try {
      const uploadedFiles = [] as Array<{ name: string; size: string; url: string }>;
      for (const file of files) {
        const uploaded = await uploadArticleFichier(articleId, file);
        uploadedFiles.push({
          name: uploaded.nomFichier,
          size: `${(uploaded.taille / 1024).toFixed(0)} KB`,
          url: uploaded.url,
        });
      }
      setArticles(prev => prev.map(a => {
        if (a.id === articleId) {
          return { ...a, files: [...(a.files || []), ...uploadedFiles] };
        }
        return a;
      }));
    } catch(err: any) {
      alert('Erreur: ' + err.message);
    } finally {
      setIsUploading(null);
      e.target.value = '';
    }
  };

  const handleSignalSubmit = async () => {
    if (!signalMotif) {
      alert("Veuillez sélectionner un motif.");
      return;
    }
    if (!projet) return;

    setIsSignaling(true);
    try {
      if (signalModal.type === 'projet') {
        await refuserProjet(projet.id, {
          motifRefus: signalMotif,
          descriptionRefus: signalDescription
        });
        navigate('/chiffrage/demandes');
      } else if (signalModal.type === 'article' && signalModal.targetId) {
        await signalerArticle(signalModal.targetId, {
          motif: signalMotif,
          description: signalDescription
        });
        // Remove article from list or mark it as signaled
        setArticles(a => a.map(art => art.id === signalModal.targetId ? {
          ...art,
          statusInterne: 'signale',
          motifSignalement: signalMotif,
          descriptionSignalement: signalDescription,
        } : art));
        setSignalModal({ isOpen: false });
        setSignalMotif('');
        setSignalDescription('');
      }
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    } finally {
      setIsSignaling(false);
    }
  };

  const handleSendMessage = async () => {
    const trimmed = chatDraft.trim();
    if (!trimmed || !socket || !user) return;
    
    const token = sessionStorage.getItem('fournisseur_token');
    let realName = user.nomEntreprise || 'Fournisseur';
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.name) realName = decoded.name;
        else if (decoded.given_name) realName = `${decoded.given_name} ${decoded.family_name || ''}`.trim();
      } catch (e) {}
    }

    const payload = {
      roomId,
      senderId: user.keycloakId || String(user.entrepriseId),
      senderName: realName,
      senderType: 'FOURNISSEUR',
      message: trimmed,
    };
    
    try {
      const token = sessionStorage.getItem('fournisseur_token');
      await fetch(`${getNotificationBackendURL()}/api/chat/${roomId}/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setChatDraft('');
    } catch (err) {}
  };

  const handleAddLibraryArticle = async (form: any, documentFile: File | null) => {
    try {
      const uuid = getConnectedUserUUID();
      if (!uuid) {
        toast.error('Impossible de récupérer l\'identifiant utilisateur');
        return;
      }

      await createArticleComplet(form, documentFile, uuid);
      toast.success('Article ajouté avec succès à la bibliothèque !');
      setLibraryModal({ isOpen: false });
    } catch (err: any) {
      toast.error(`Erreur lors de l'ajout: ${err.message || 'Erreur inconnue'}`);
    }
  };

  if (isLoading) return <div className="p-5 text-center"><div className="spinner-border text-primary" /></div>;
  if (error || !projet) return <div className="p-5 text-center text-danger">{error || 'Projet introuvable'}</div>;

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="app-page-head mb-4 text-start">
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-3">
          <div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-1">
                <li className="breadcrumb-item small"><Link to="/chiffrage/demandes">Demandes</Link></li>
                <li className="breadcrumb-item active small">Chiffrage</li>
              </ol>
            </nav>
            <div className="d-flex align-items-center gap-3">
              <h1 className="app-page-title mb-0 fs-3 fw-extrabold">{projet.nomProjet}</h1>
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 rounded-pill small fw-bold">PRJ-{projet.projetId}</span>
            </div>
          </div>
          {!isLocked && (
            <div className="d-flex gap-2">
              <button className="btn btn-outline-danger btn-sm px-3 rounded-pill shadow-sm fw-bold border" onClick={() => setSignalModal({ isOpen: true, type: 'projet' })}>
                <i className="fi fi-rr-cross-circle me-1"></i> Refuser la demande
              </button>
              {isNouveau ? (
                <button className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm fw-bold border-0" style={{ backgroundColor: '#316AFF' }} onClick={handleAcceptProject} disabled={isSaving}>
                  {isSaving ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="fi fi-rr-check me-1"></i>}
                  Accepter le projet
                </button>
              ) : (
                <>
                  <button className="btn btn-outline-secondary btn-sm px-3 rounded-pill bg-white shadow-sm fw-bold" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="fi fi-rr-disk me-1"></i>} 
                    Sauvegarder
                  </button>
                  <button className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm fw-bold border-0" style={{ backgroundColor: '#316AFF' }} onClick={handleSubmitDevis} disabled={isSaving}>
                    <i className="fi fi-rr-paper-plane me-1"></i> Envoyer le Devis
                  </button>
                </>
              )}
            </div>
          )}
          {isTermine && (
            <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-4 py-2 rounded-pill fw-black uppercase tracking-widest animate__animated animate__pulse animate__infinite">
               <i className="fi fi-rr-check-circle me-2"></i> DEVIS SOUMIS LE {projet.dateRetour ? new Date(projet.dateRetour).toLocaleDateString('fr-FR') : '--'}
            </div>
          )}
        </div>

        <div className="card border-0 shadow-sm bg-white p-3 rounded-4">
          <div className="row align-items-center">
            <div className="col-md-4 border-end">
              <div className="d-flex align-items-center gap-3">
                <div className="avatar avatar-sm bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center"><i className="fi fi-rr-clock"></i></div>
                <div>
                  <small className="text-muted d-block fw-bold" style={{ fontSize: '10px' }}>ÉCHÉANCE</small>
                  <span className="fw-bold text-dark">{projet.deadline ? new Date(projet.deadline).toLocaleDateString('fr-FR') : 'Non spécifiée'}</span>
                  {projet.deadline && new Date(projet.deadline) < new Date() && projet.status !== 'termine' && (
                    <span className="badge bg-danger ms-2 px-2 py-1" style={{ fontSize: '9px' }}>RETARD</span>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-4 border-end">
              <div className="d-flex align-items-center gap-3">
                <div className="avatar avatar-sm bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center"><i className="fi fi-rr-layers"></i></div>
                <div>
                  <small className="text-muted d-block fw-bold" style={{ fontSize: '10px' }}>LOT CONCERNÉ</small>
                  <span className="fw-bold text-dark">{projet.lots && projet.lots.length > 0 ? projet.lots.map(l => l.nomProjetLot).join(', ') : 'Lots Multiples'}</span>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-3">
                <div className="avatar avatar-sm bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center"><i className="fi fi-rr-check"></i></div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-muted fw-bold" style={{ fontSize: '10px' }}>COMPLÉTION</small>
                    <small className="fw-bold text-success">{completionRate}%</small>
                  </div>
                  <div className="progress" style={{ height: '4px' }}>
                    <div className="progress-bar bg-success" style={{ width: `${completionRate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-9 text-start">
          {/* ── New Horizontal Résumé Offre ── */}
          <div className="d-flex bg-white rounded-3 shadow-sm overflow-hidden mb-4" style={{ minHeight: '80px', border: '1px solid #E8ECF4' }}>
            <div className="d-flex align-items-center justify-content-center flex-column p-3" style={{ width: '130px', backgroundColor: '#6Cb2FF', color: 'white' }}>
               <h5 className="mb-0 fw-bold text-center lh-sm" style={{ fontSize: '15px' }}>Résumé<br/>Offre</h5>
            </div>
            <div className="d-flex flex-grow-1 align-items-center justify-content-around py-2 px-3">
              <div className="text-center">
                 <div className="fw-extrabold text-primary mb-1" style={{ fontSize: '15px' }}>{totalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
                 <div className="text-dark fw-bold small text-uppercase" style={{ fontSize: '11px' }}>Total HT (€)</div>
              </div>
              <div className="text-center">
                 <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>{articles.length}</div>
                 <div className="text-muted fw-bold small text-uppercase" style={{ fontSize: '11px' }}>Articles chiffrés</div>
              </div>
              <div className="text-center">
                 <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>{missingCount}</div>
                 <div className="text-muted fw-bold small text-uppercase" style={{ fontSize: '11px' }}>Restants</div>
              </div>
              <div className="text-center">
                 <div className="d-flex align-items-center justify-content-center bg-light rounded-pill px-2 mb-1" style={{ width: '80px', margin: '0 auto', height: '26px' }}>
                    <input
                      type="number"
                      className="form-control form-control-sm border-0 bg-transparent text-end fw-bold p-0 me-1 text-dark"
                      value={globalTva === 0 ? '' : globalTva}
                      min={0}
                      max={100}
                      style={{ fontSize: '13px' }}
                      onChange={(e) => handleGlobalTvaChange(e.target.value)}
                      disabled={isLocked || isNouveau}
                    />
                    <span className="fw-bold text-muted" style={{ fontSize: '11px' }}>%</span>
                 </div>
                 <div className="text-muted fw-bold small text-uppercase" style={{ fontSize: '11px' }}>TVA</div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <div className="card-header bg-white border-bottom p-3 d-flex gap-3 align-items-center">
              <div className="flex-grow-1 position-relative">
                <i className="fi fi-rr-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input type="text" className="form-control form-control-sm ps-5 bg-light border-light rounded-pill py-2"
                  placeholder="Rechercher un article..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="btn-group btn-group-sm">
                <button onClick={() => setFilterMissing(false)} className={`btn px-4 rounded-pill me-2 border-0 ${!filterMissing ? 'btn-primary shadow-sm' : 'btn-light'}`}>Tous</button>
                <button onClick={() => setFilterMissing(true)} className={`btn px-4 rounded-pill border-0 ${filterMissing ? 'btn-warning shadow-sm' : 'btn-light'}`}>Non chiffrés</button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: '#0978E8' }}>
                  <tr className="small text-uppercase border-0" style={{ letterSpacing: '0.5px' }}>
                    <th className="px-4 py-3 text-white fw-bold bg-transparent" style={{ width: '120px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Ref</th>
                    <th className="py-3 text-white fw-bold bg-transparent">Article & Specs</th>
                    <th className="py-3 text-center text-white fw-bold bg-transparent">Quantité</th>
                    <th className="py-3 text-white fw-bold bg-transparent" style={{ width: '160px' }}>Prix Unitaire HT</th>
                    <th className="py-3 text-white fw-bold bg-transparent" style={{ width: '160px' }}>Remise</th>
                    <th className="py-3 text-white fw-bold bg-transparent" style={{ width: '160px' }}>TVA</th>
                    <th className="py-3 text-white fw-bold bg-transparent" style={{ width: '220px' }}>Fichiers</th>
                    {showStatusAndActionColumns && (
                      <th className="py-3 text-center text-white fw-bold bg-transparent" style={{ width: '130px' }}>Statut</th>
                    )}
                    <th className="px-4 py-3 text-end text-white fw-bold bg-transparent" style={{ width: '160px', borderTopRightRadius: !showStatusAndActionColumns ? '8px' : '0', borderBottomRightRadius: !showStatusAndActionColumns ? '8px' : '0' }}>Total HT (€)</th>
                    {showStatusAndActionColumns && (
                      <th className="px-4 py-3 text-center text-white fw-bold bg-transparent" style={{ width: '130px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map(a => (
                    <React.Fragment key={a.id}>
                      <tr className={`${expandedArticle === a.id ? 'bg-primary bg-opacity-10' : (a.statusInterne === 'Non chiffré' || a.statusInterne === 'Non chiffre' || a.price === '') ? 'bg-warning bg-opacity-10' : ''}`}>
                        <td className="px-4"><code className="text-primary fw-bold small">{a.code}</code></td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="fw-bold text-dark">{a.label}</div>
                          </div>
                          <button className="btn btn-link p-0 text-primary small text-decoration-none d-flex align-items-center gap-1"
                            onClick={() => setExpandedArticle(expandedArticle === a.id ? null : a.id)} style={{ fontSize: '11px' }}>
                            <i className={`fi fi-rr-angle-small-${expandedArticle === a.id ? 'up' : 'down'}`}></i>
                            {expandedArticle === a.id ? 'Cacher' : 'Détails & Fichiers'}
                          </button>
                        </td>
                        <td className="text-center"><span className="fw-bold text-dark">{a.qty}</span><small className="ms-1 text-muted">{a.unit}</small></td>
                        <td>
                          <div className="position-relative">
                            <input type="number" className={`form-control form-control-sm text-end fw-bold pe-4 rounded-3 pricing-input ${a.price > 0 ? 'text-primary' : 'text-muted'}`}
                              value={a.price === '' ? '' : a.price} placeholder="0.00"
                              onChange={(e) => handlePriceChange(a.id, e.target.value)} 
                              disabled={isLocked || isNouveau}
                            />
                            <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-muted" style={{ fontSize: '0.75rem' }}>€</span>
                          </div>
                          {a.catalogPrice > 0 && a.price === '' && !isLocked && !isNouveau && (
                            <button className="btn btn-link p-0 w-100 text-end text-primary mt-1 text-decoration-none"
                              style={{ fontSize: '11px' }} onClick={() => applyCatalogPrice(a.id, a.catalogPrice)}>
                              <i className="fi fi-rr-magic-wand me-1"></i> Appliquer mon prix
                            </button>
                          )}
                        </td>
                        <td>
                          <div className="position-relative">
                            <input
                              type="number"
                              className={`form-control form-control-sm text-end fw-bold pe-4 rounded-3 pricing-input ${typeof a.remise === 'number' && a.remise > 0 ? 'text-success' : 'text-muted'} ${remiseFlashId === a.id ? 'remise-autofill-flash' : ''}`}
                              value={a.remise === '' ? '' : a.remise}
                              placeholder="0.00"
                              min={0}
                              max={typeof a.price === 'number' ? a.price : undefined}
                              onChange={(e) => handleRemiseChange(a.id, e.target.value)}
                              disabled={isLocked || isNouveau || !(typeof a.price === 'number' && a.price > 0)}
                            />
                            <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-muted" style={{ fontSize: '0.75rem' }}>€</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <span className="badge rounded-pill bg-light text-primary border px-3 py-2 fw-bold" style={{ minWidth: '88px', fontSize: '12px' }}>
                              {Number(a.tva || 0).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="space-y-2">
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                              {(a.files || []).length > 0 ? (
                                (a.files || []).map((f: any, idx: number) => (
                                  <a
                                    key={`${a.id}-file-${idx}`}
                                    href={f.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="badge bg-primary-subtle text-primary border border-primary-subtle text-decoration-none"
                                  >
                                    {f.name}
                                  </a>
                                ))
                              ) : (
                                <span className="text-muted small">Aucun fichier</span>
                              )}
                            </div>
                            {!isLocked && !isNouveau && (
                              <label className="btn btn-sm btn-outline-primary rounded-pill px-3 mb-0">
                                Ajouter fichiers
                                <input type="file" className="d-none" onChange={(e) => handleFileUpload(a.id, e)} disabled={isUploading === a.id || isLocked || isNouveau} multiple />
                              </label>
                            )}
                          </div>
                        </td>
                        {showStatusAndActionColumns && (
                          <td className="text-center">
                            {(a.statusInterne === 'en_attente_chiffrage' || a.statusInterne === 'Non chiffré' || a.statusInterne === 'Non chiffre' || a.price === '') && (
                              <span className="badge bg-warning text-dark px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>Non chiffré</span>
                            )}
                            {a.statusInterne === 'chiffre' && (
                              <span className="badge bg-success text-white px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>Chiffré</span>
                            )}
                            {a.statusInterne === 'signale' && (
                              <span className="badge bg-danger text-white px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>Signalé</span>
                            )}
                            {a.statusInterne === 'valide' && (
                              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>Validé</span>
                            )}
                            {a.statusInterne === 'rejete' && (
                              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>Rejeté</span>
                            )}
                          </td>
                        )}
                        <td className="px-4 text-end">
                          <span className={`fw-extrabold ${typeof a.price === 'number' && a.price > 0 ? 'text-dark' : 'text-muted'}`}>
                            {getArticleTotalHT(a).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                          </span>
                        </td>
                        {showStatusAndActionColumns && (
                          <td className="px-4 text-center">
                            {!isLocked && (
                              <div className="d-inline-flex align-items-center gap-2">
                                <button
                                  type="button"
                                  className="btn btn-sm p-0 border-0 bg-transparent text-warning"
                                  title="Signaler un problème sur cet article"
                                  disabled={isLocked}
                                  onClick={() => setSignalModal({ isOpen: true, targetId: a.id, type: 'article' })}
                                >
                                  <i className="fi fi-rr-exclamation" />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm p-0 border-0 bg-transparent text-primary"
                                  title="Ajouter à la bibliothèque"
                                  disabled={isLocked}
                                  onClick={() => {
                                    setLibraryModal({ isOpen: true, article: a });
                                    setLibraryFormData({
                                      lot: projet.lots?.find(l => l.articles?.some(ar => ar.id === a.id))?.nomProjetLot || '',
                                      ref: a.code,
                                      nom: a.label,
                                      date: new Date().toISOString().split('T')[0],
                                      prixUnitaire: a.price ? String(a.price) : '',
                                      unite: a.unit || 'U',
                                      decompose: false,
                                      fourniture: '',
                                      accessoires: '',
                                      pose: '',
                                      cadence: '',
                                      coefficient: ''
                                    });
                                  }}
                                >
                                  <i className="fi fi-rr-book-alt" />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm p-0 border-0 bg-transparent text-secondary"
                                  title="Associer à un article existant"
                                  disabled={isLocked}
                                  onClick={() => setAssociateModal({ isOpen: true, article: a })}
                                >
                                  <i className="fi fi-rr-link-alt" />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm p-0 border-0 bg-transparent text-info"
                                  title="Détails"
                                  disabled={isLocked}
                                  onClick={() => setExpandedArticle(expandedArticle === a.id ? null : a.id)}
                                >
                                  <i className="fi fi-rr-add" />
                                </button>
                              </div>
                            )}
                            {isTermine && (
                              <button 
                                  className={`badge border-0 rounded-pill px-3 py-2 cursor-pointer transition-all hover:scale-105 shadow-sm font-black uppercase text-[9px] tracking-widest ${
                                      a.statusInterne === 'valide' ? 'bg-emerald-600 text-white' : 
                                      a.statusInterne === 'rejete' ? 'bg-rose-600 text-white' : 
                                      a.statusInterne === 'signale' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                                  }`}
                                  onClick={() => setTimelineModal({ isOpen: true, article: a })}
                              >
                                  <i className={`fi ${
                                      a.statusInterne === 'valide' ? 'fi-rr-check' : 
                                      a.statusInterne === 'rejete' ? 'fi-rr-cross' : 
                                      a.statusInterne === 'signale' ? 'fi-rr-exclamation' : 'fi-rr-clock'
                                  } me-1`}></i>
                                  {a.statusInterne === 'rejete' ? 'REFUSE' : a.statusInterne === 'valide' ? 'ACCEPTE' : a.statusInterne?.replace('_', ' ') || 'EN ATTENTE'}
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                      {expandedArticle === a.id && (
                        <tr className="bg-primary bg-opacity-10 animate__animated animate__fadeIn">
                          <td colSpan={showStatusAndActionColumns ? 9 : 7} className="px-4 py-3 border-top-0">
                            <div className="row g-4">
                              <div className="col-md-7">
                                <h6 className="small fw-extrabold text-primary mb-2">Description Technique</h6>
                                <p className="text-muted small mb-0 lh-base">{a.detailsDescription || 'Aucune description fournie.'}</p>
                              </div>
                              <div className="col-md-5">
                                <h6 className="small fw-extrabold text-primary mb-2">Documents</h6>
                                <div className="vstack gap-2">
                                  {(a.files || []).map((f, idx) => (
                                    <div key={idx} className="d-flex align-items-center justify-content-between p-2 bg-white rounded-3 border">
                                      <div className="d-flex align-items-center gap-2 overflow-hidden">
                                        <i className={`fi ${f.name.endsWith('.pdf') ? 'fi-rr-file-pdf text-danger' : 'fi-rr-picture text-info'} fs-5`}></i>
                                        <div className="text-truncate">
                                          <div className="small fw-bold text-dark text-truncate">{f.name}</div>
                                          <div className="text-muted" style={{ fontSize: '9px' }}>{f.size}</div>
                                        </div>
                                      </div>
                                      <a href={f.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light rounded-circle shadow-sm"><i className="fi fi-rr-download text-primary"></i></a>
                                    </div>
                                  ))}
                                  {(!a.files || a.files.length === 0) && (
                                    <div className="small text-muted">Aucun document joint.</div>
                                  )}
                                  <div className="mt-2">
                                    <label className={`btn btn-sm btn-outline-primary rounded-pill px-3 shadow-sm ${isUploading === a.id ? 'disabled' : ''}`}>
                                      {isUploading === a.id ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="fi fi-rr-upload me-1"></i>}
                                      Joindre un document (Devis/Plan)
                                      <input type="file" className="d-none" onChange={(e) => handleFileUpload(a.id, e)} disabled={isUploading === a.id || isLocked || isNouveau} multiple />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          {showChat ? (
          <div className="card border-0 shadow-sm rounded-4 bg-white sticky-top" style={{ top: '80px', border: '1px solid #E8ECF4' }}>
            <div className="card-header border-bottom bg-white d-flex justify-content-between align-items-center py-3 px-3" style={{ borderRadius: '16px 16px 0 0' }}>
              <h6 className="fw-extrabold mb-0 text-dark" style={{ fontSize: '14px' }}>Espace d'échange</h6>
              <span className="d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#F3F6FC', border: '1px solid #D9E4FA' }}>
                <i className="fi fi-rr-comments text-primary" style={{ fontSize: '12px' }} />
              </span>
            </div>
            {!chatWritable && (
              <div className="mx-3 mt-3 py-2 text-center" style={{ backgroundColor: '#FFF4E5', color: '#D2752B', fontSize: '11px', borderRadius: '8px', borderLeft: '3px solid #F59E0B', fontWeight: '600' }}>
                Lecture seule (termine).
              </div>
            )}
            <div className="card-body border-top-0 pt-3 px-3" style={{ height: '380px', overflowY: 'auto' }}>
              <div className="vstack gap-3">
                {chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`d-flex ${m.from === 'fournisseur' ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    {m.from === 'projet' && (
                      <div className="d-flex flex-column align-items-start">
                        <div className="bg-light text-dark p-2 px-3 shadow-sm border border-light" style={{ borderRadius: '12px 12px 12px 2px', backgroundColor: '#F8FAFC', minWidth: '150px' }}>
                          <div className="d-flex gap-2 align-items-center mb-1">
                            <span className="fw-bold text-dark" style={{ fontSize: '10.5px' }}>{m.senderName ? m.senderName : "Admin Hayder"}</span>
                            <span className="text-muted" style={{ fontSize: '9.5px' }}>{m.time}</span>
                          </div>
                          <div className="lh-sm text-dark mt-1" style={{ wordBreak: 'break-word', fontWeight: '500', fontSize: '12px' }}>{m.message}</div>
                        </div>
                      </div>
                    )}

                    {m.from === 'fournisseur' && (
                      <div className="d-flex flex-column align-items-end">
                        <div className="text-white p-2 px-3 shadow-sm border-0" style={{ borderRadius: '12px 12px 2px 12px', backgroundColor: '#5D8BFF', minWidth: '150px', transform: 'translateX(5px)' }}>
                          <div className="d-flex gap-2 justify-content-between align-items-center mb-1">
                            <span className="fw-bold text-white text-nowrap" style={{ fontSize: '10.5px' }}>{m.senderName ? m.senderName : "bouchniba boch"}</span>
                            <span className="text-white-50" style={{ fontSize: '9.5px' }}>{m.time}</span>
                          </div>
                          <div className="lh-sm text-white mt-1" style={{ wordBreak: 'break-word', fontWeight: '600', fontSize: '12px' }}>{m.message}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {chatMessages.length === 0 && (
                  <div className="text-center text-muted small py-4 mt-4">
                    <i className="fi fi-rr-comments text-primary fs-3 d-block mb-2 opacity-50" />
                    <span style={{ fontSize: '11px' }}>Aucun message.</span>
                  </div>
                )}
                <div ref={chatScrollRef} />
              </div>
            </div>
            <div className="card-footer border-top bg-white p-3 pt-3" style={{ borderRadius: '0 0 16px 16px', borderTopColor: '#E8ECF4' }}>
              <div className="d-flex flex-column gap-2 mb-1">
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control border rounded-3 py-2 shadow-none flex-grow-1"
                    placeholder="Message..."
                    style={{ fontSize: '13px', borderColor: '#E8ECF4', color: '#64748B' }}
                    value={chatDraft}
                    onChange={(e) => setChatDraft(e.target.value)}
                    disabled={!chatWritable}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                    style={{ backgroundColor: '#8CB4FF', borderColor: '#8CB4FF', width: '40px', height: '38px', padding: '0' }}
                    onClick={handleSendMessage}
                    disabled={!chatWritable || !chatDraft.trim()}
                  >
                    <i className="fi fi-rr-paper-plane text-white" style={{ fontSize: '14px', marginTop: '3px', marginLeft: '-2px' }}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          ) : (
          <div className="alert alert-info small">
            Le chat sera disponible une fois le projet accepté.
          </div>
          )}
          
          <div className="p-3 bg-light rounded-3 border mt-4">
            <h6 className="small fw-extrabold text-dark mb-2" style={{ textTransform: 'uppercase', fontSize: '11px' }}>Notes Client</h6>
            <p className="text-muted small mb-0 lh-sm" style={{ fontSize: '11px' }}>"Merci de privilégier les matériaux de marques NF. Livraison attendue sur site."</p>
          </div>
        </div>
      </div>

      {/* Ligne Chat supprimée car intégrée à droite */}

      {/* Article Timeline Modal */}
      {timelineModal.isOpen && timelineModal.article && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9001 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '540px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__zoomIn">
              <div className="modal-header border-bottom p-4 bg-white d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="modal-title fw-black mb-1 text-dark uppercase tracking-tighter">Timeline du projet</h5>
                  <p className="text-muted small mb-0 font-medium">Historique de l'article #{timelineModal.article.code}</p>
                </div>
                <button type="button" className="btn-close shadow-none" onClick={() => setTimelineModal({ isOpen: false })}></button>
              </div>
              
              <div className="modal-body p-4 bg-white">
                <div className="ps-4 position-relative border-start border-2 border-slate-100 ms-3">
                  {(() => {
                    const article = timelineModal.article;
                    const stages: any[] = [
                      { label: 'Reçu', date: projet.dateEnvoi, desc: 'Consultation reçue dans le portail fournisseur', icon: 'fi-rr-inbox-in' },
                      { label: 'En cours de chiffrage', date: projet.dateEnvoi, desc: 'Ouverture du dossier et début de saisie des prix', icon: 'fi-rr-edit' },
                      { label: 'Chiffré et envoyé', date: article.dateChiffrage || projet.dateRetour, desc: 'Montant validé et transmis à l’équipe projet', icon: 'fi-rr-check' },
                    ];

                    if (article.statusInterne === 'signale') {
                      stages.push({
                        label: 'Signalé',
                        date: article.dateChiffrage || projet.dateRetour,
                        desc: article.motifSignalement
                          ? `${article.motifSignalement}${article.descriptionSignalement ? ` : ${article.descriptionSignalement}` : ''}`
                          : 'Article signalé au projet avec motif.',
                        icon: 'fi-rr-exclamation',
                        highlight: 'danger',
                      });
                    } else {
                      stages.push({ label: 'En attente de réponse', date: projet.dateRetour, desc: 'Analyse par le bureau d’étude interne', icon: 'fi-rr-hourglass' });
                      if (article.statusInterne === 'valide' || article.statusInterne === 'rejete') {
                        stages.push({
                          label: article.statusInterne === 'valide' ? 'Accepté' : 'Refusé',
                          date: projet.dateRetour,
                          desc: article.motifRefusInterne
                            ? `${article.motifRefusInterne}${article.descriptionRefusInterne ? ` : ${article.descriptionRefusInterne}` : ''}`
                            : (article.statusInterne === 'valide' ? 'Votre offre a été retenue pour cet article.' : 'Décision interne défavorable.'),
                          icon: article.statusInterne === 'valide' ? 'fi-rr-following' : 'fi-rr-cross',
                          highlight: article.statusInterne === 'valide' ? 'success' : 'danger',
                        });
                      }
                    }

                    return stages.map((stage, idx) => (
                    <div key={idx} className="mb-4 position-relative">
                      {/* Timeline Dot */}
                      <div 
                        className={`position-absolute rounded-pill d-flex align-items-center justify-content-center text-white shadow-sm transition-all hover:scale-110`}
                        style={{
                          left: '-44px',
                          top: '0',
                          width: '36px',
                          height: '36px',
                          backgroundColor: stage.highlight === 'success' ? '#10b981' : stage.highlight === 'danger' ? '#ef4444' : '#316AFF',
                          zIndex: 2
                        }}
                      >
                        <i className={`fi ${stage.icon} fs-6`}></i>
                      </div>
                      
                      <div className="ps-2">
                        <h6 className={`fw-black mb-1 text-slate-900 uppercase tracking-tighter ${stage.highlight ? `text-${stage.highlight}` : ''}`}>{stage.label}</h6>
                        <p className="text-slate-500 small mb-1 leading-tight font-medium" style={{ fontSize: '11px' }}>{stage.desc}</p>
                        <p className="fw-black text-slate-400 mt-1 uppercase" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                            {stage.date ? new Date(stage.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '--'}
                        </p>
                      </div>
                    </div>
                  ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Signal Modal */}
      {signalModal.isOpen && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 9000 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 9001 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow-lg">
                <div className="modal-header border-bottom-0 pb-0">
                  <h5 className="modal-title fw-extrabold text-danger flex items-center gap-2">
                    <i className="fi fi-rr-exclamation-triangle"></i> 
                    {signalModal.type === 'projet' ? 'Refuser la demande de projet' : 'Signaler un problème sur cet article'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setSignalModal({ isOpen: false })} disabled={isSignaling}></button>
                </div>
                <div className="modal-body">
                  <p className="text-muted small mb-4">
                    Veuillez indiquer le motif exact afin que l'équipe projet puisse traiter votre retour.
                  </p>
                  
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Motif <span className="text-danger">*</span></label>
                    <select className="form-select form-select-sm" value={signalMotif} onChange={e => setSignalMotif(e.target.value)}>
                      <option value="">Sélectionnez un motif</option>
                      {signalModal.type === 'projet' ? (
                        <>
                          <option value="Délai trop court">Délai trop court</option>
                          <option value="Charge de travail actuelle">Charge de travail actuelle</option>
                          <option value="Compétences / Secteur d'activité hors scope">Secteur d'activité hors scope</option>
                          <option value="Autre">Autre</option>
                        </>
                      ) : (
                        <>
                          <option value="Article indisponible / obsolète">Article indisponible / obsolète</option>
                          <option value="Description incomplète">Description incomplète</option>
                          <option value="Erreur d'unité">Erreur d'unité de mesure</option>
                          <option value="Autre">Autre</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Détails supplémentaires</label>
                    <textarea 
                      className="form-control form-control-sm" 
                      rows={3} 
                      placeholder="Apportez plus de précisions..."
                      value={signalDescription}
                      onChange={e => setSignalDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top-0 d-flex justify-content-between pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4 text-muted fw-bold" onClick={() => setSignalModal({ isOpen: false })} disabled={isSignaling}>Annuler</button>
                  <button type="button" className="btn btn-danger rounded-pill px-4 fw-bold shadow-sm" onClick={handleSignalSubmit} disabled={isSignaling || !signalMotif}>
                    {isSignaling ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="fi fi-rr-paper-plane me-2"></i>}
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Library/Catalogue Modal */}
      {libraryModal.isOpen && (
        <AddArticleModal
          initialData={libraryFormData}
          onClose={() => setLibraryModal({ isOpen: false })}
          onAdd={handleAddLibraryArticle}
        />
      )}

      {/* Associate Modal */}
      {associateModal.isOpen && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 9000, backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 9001 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '950px' }}>
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden animate__animated animate__fadeIn">
                <div className="modal-body p-4 p-md-5 bg-white">
                  <h5 className="fw-extrabold text-dark d-flex align-items-center gap-2 mb-4" style={{ fontSize: '18px' }}>
                    <div className="avatar avatar-xs bg-primary bg-opacity-10 text-primary rounded-1 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                      <i className="fi fi-rr-link-alt" style={{ fontSize: '14px' }}></i>
                    </div>
                    Associer à un article existant
                  </h5>
                  
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div className="d-flex gap-3 flex-grow-1" style={{ maxWidth: '650px' }}>
                      <div className="position-relative flex-grow-1" style={{ maxWidth: '300px' }}>
                        <i className="fi fi-rr-search position-absolute top-50 translate-middle-y text-primary" style={{ left: '16px' }}></i>
                        <input 
                          type="text" 
                          className="form-control form-control-sm border ps-5 py-2 shadow-none rounded-pill" 
                          placeholder="Rechercher par nom ou REF"
                          value={associateSearch}
                          onChange={e => {
                            setAssociateSearch(e.target.value);
                            setAssociatePage(1);
                          }}
                        />
                      </div>
                      <select 
                        className="form-select form-select-sm border-0 py-2 shadow-none rounded-pill" 
                        style={{ maxWidth: '250px', backgroundColor: '#F8FAFC' }}
                        value={associateLot}
                        onChange={e => {
                          setAssociateLot(e.target.value);
                          setAssociatePage(1);
                        }}
                      >
                        <option value="">Tous les lots</option>
                        {uniqueLots.map(lot => (
                          <option key={lot} value={lot}>{lot}</option>
                        ))}
                      </select>
                    </div>
                    <div className="d-flex gap-3">
                       <button type="button" className="btn bg-white border border-primary text-primary rounded-pill px-4 py-2 fw-bold shadow-sm" style={{ fontSize: '13px', minWidth: '110px' }} onClick={() => setAssociateModal({ isOpen: false })}>Annuler</button>
                    </div>
                  </div>

                  {associateLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" />
                      <p className="text-muted mt-3">Chargement des articles...</p>
                    </div>
                  ) : filteredAssociateArticles.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fi fi-rr-inbox text-muted" style={{ fontSize: '32px' }}></i>
                      <p className="text-muted mt-3">Aucun article trouvé</p>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive mb-4">
                        <table className="table table-borderless align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
                          <thead style={{ backgroundColor: '#0978E8' }}>
                            <tr className="small text-uppercase border-0" style={{ letterSpacing: '0.5px' }}>
                              <th className="text-white fw-bold py-3 px-4 bg-transparent" style={{ fontSize: '12px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>LOT</th>
                              <th className="text-white fw-bold py-3 bg-transparent" style={{ fontSize: '12px' }}>REF / Nom article</th>
                              <th className="text-white fw-bold py-3 text-center bg-transparent" style={{ fontSize: '12px' }}>Unité</th>
                              <th className="text-white fw-bold py-3 text-center bg-transparent" style={{ fontSize: '12px' }}>PU</th>
                              <th className="text-white fw-bold py-3 text-center bg-transparent" style={{ fontSize: '12px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>Choisir</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{ height: '12px' }}></tr>
                            {paginatedAssociateArticles.map((item, idx) => (
                              <React.Fragment key={idx}>
                                <tr style={{ backgroundColor: '#F8FAFC' }}>
                                  <td className="py-3 px-4 fw-black text-dark" style={{ fontSize: '12px', width: '18%', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                                    <div style={{ maxWidth: '120px', lineHeight: '1.4' }}>{item.lot || '—'}</div>
                                  </td>
                                  <td className="py-3" style={{ width: '32%' }}>
                                     <div className="fw-extrabold text-dark mb-1" style={{ fontSize: '12px' }}>{item.nomArticle || '—'}</div>
                                     <div className="text-muted fw-bold" style={{ fontSize: '10px', textTransform: 'uppercase' }}>{item.refArticle || '—'}</div>
                                  </td>
                                  <td className="py-3 text-center fw-extrabold text-dark" style={{ fontSize: '12px' }}>{item.unite || '—'}</td>
                                  <td className="py-3 text-center fw-extrabold text-dark" style={{ fontSize: '12px' }}>{item.pu || 0} €</td>
                                  <td className="py-3 text-center" style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                                     <button 
                                       className="btn btn-sm btn-primary rounded-pill px-4 fw-bold shadow-sm" 
                                       style={{ backgroundColor: '#6Cb2FF', borderColor: '#6Cb2FF', fontSize: '11px' }}
                                       onClick={() => handleAssociateArticle(item)}
                                     >
                                       Choisir
                                     </button>
                                  </td>
                                </tr>
                                <tr style={{ height: '8px', backgroundColor: 'transparent' }}></tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {totalAssociatePages > 1 && (
                        <div className="d-flex justify-content-center align-items-center gap-2 text-primary mt-4 flex-wrap">
                          <button 
                            className="btn btn-sm border-0 bg-transparent text-primary p-0 d-flex align-items-center justify-content-center" 
                            style={{ width: '24px' }}
                            onClick={() => setAssociatePage(Math.max(1, associatePage - 1))}
                            disabled={associatePage === 1}
                          >
                            <i className="fi fi-rr-angle-left"></i>
                          </button>
                          {Array.from({ length: Math.min(5, totalAssociatePages) }).map((_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                className={pageNum === associatePage ? 'btn rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm' : 'btn btn-sm border-0 bg-transparent text-primary fw-bold'}
                                style={pageNum === associatePage ? {
                                  backgroundColor: '#0084FF',
                                  color: '#fff',
                                  width: '32px',
                                  height: '32px',
                                  fontSize: '13px'
                                } : { fontSize: '13px' }}
                                onClick={() => setAssociatePage(pageNum)}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          {totalAssociatePages > 5 && (
                            <>
                              <span className="text-primary fw-medium" style={{ letterSpacing: '2px' }}>...</span>
                              <button
                                className="btn btn-sm border-0 bg-transparent text-primary fw-bold"
                                style={{ fontSize: '13px' }}
                                onClick={() => setAssociatePage(totalAssociatePages)}
                              >
                                {totalAssociatePages}
                              </button>
                            </>
                          )}
                          <button 
                            className="btn btn-sm border-0 bg-transparent text-primary p-0 d-flex align-items-center justify-content-center" 
                            style={{ width: '24px' }}
                            onClick={() => setAssociatePage(Math.min(totalAssociatePages, associatePage + 1))}
                            disabled={associatePage === totalAssociatePages}
                          >
                            <i className="fi fi-rr-angle-right"></i>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Unpriced Warning Modal */}
      {unpricedWarningModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 9000, backgroundColor: 'rgba(0,0,0,0.2)' }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 9001 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden animate__animated animate__zoomIn animate__faster">
                <div className="modal-body p-4 p-md-4 text-center bg-white rounded-4">
                  <div className="d-flex align-items-center mb-4">
                     <i className="fi fi-rr-calendar-xmark text-danger me-3" style={{ fontSize: '20px' }}></i>
                     <h5 className="fw-black text-dark mb-0" style={{ fontSize: '16px' }}>Articles non chiffrés détectés</h5>
                  </div>
                  <div className="fw-extrabold text-start text-dark mb-3" style={{ fontSize: '13px' }}>
                    Certains articles n'ont pas encore été chiffrés.
                  </div>
                  <p className="text-muted text-start mb-4" style={{ fontSize: '12.5px', lineHeight: '1.6' }}>
                    Veuillez compléter les informations manquantes ou signaler les articles que vous ne pouvez pas traiter avant d'envoyer le devis.
                  </p>
                  <div className="text-center pb-2">
                    <button 
                      type="button" 
                      className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm" 
                      style={{ backgroundColor: '#6Cb2FF', borderColor: '#6Cb2FF', fontSize: '14px', minWidth: '150px' }} 
                      onClick={() => setUnpricedWarningModal(false)}
                    >
                      Compris
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .fw-extrabold { font-weight: 800; }
        .letter-spacing-1 { letter-spacing: 0.05em; }
        .transition-all { transition: all 0.3s ease; }
        .pricing-input {
          background-color: #f3f6fc !important;
          border: 1px solid #dde5f1 !important;
          height: 34px;
          box-shadow: none !important;
        }
        .pricing-input:focus {
          border-color: #93b0ff !important;
          background-color: #eef4ff !important;
        }
        .pricing-input:disabled {
          background-color: #eef1f6 !important;
          color: #9aa3b2 !important;
          opacity: 1;
        }
        .remise-autofill-flash {
          animation: remisePulse 0.52s ease;
        }
        @keyframes remisePulse {
          0% {
            background-color: #d7fbe8 !important;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45);
          }
          45% {
            background-color: #e7fff2 !important;
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.12);
          }
          100% {
            background-color: #f3f6fc !important;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
      `}</style>
    </div>
  );
}
