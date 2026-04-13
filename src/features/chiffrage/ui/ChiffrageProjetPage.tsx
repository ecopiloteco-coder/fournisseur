import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/providers/AuthContext';
import { fetchDemandeById, chiffrerArticle, soumettreDevis, ProjetFournisseurResponse, uploadArticleFichier, signalerArticle, refuserProjet } from '../api/chiffrage.api';
import { io, Socket } from 'socket.io-client';
import { getBackendURL, getNotificationBackendURL } from '../../../shared/lib/api-bridge';
import { jwtDecode } from 'jwt-decode';

export function ChiffrageProjetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [projet, setProjet] = useState<ProjetFournisseurResponse | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMissing, setFilterMissing] = useState(false);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<number | null>(null);
  
  // Signalement state
  const [isSignaling, setIsSignaling] = useState(false);
  const [signalModal, setSignalModal] = useState<{ isOpen: boolean; targetId?: number; type?: 'article' | 'projet' }>({ isOpen: false });
  const [signalMotif, setSignalMotif] = useState('');
  const [signalDescription, setSignalDescription] = useState('');
  
  // Timeline Modal
  const [timelineModal, setTimelineModal] = useState<{ isOpen: boolean; article?: any }>({ isOpen: false });
  
  // Chat
  const [chatMessages, setChatMessages] = useState<{ id: string | number; from: 'fournisseur' | 'projet'; message: string; time: string; senderName?: string }[]>([]);
  const [chatDraft, setChatDraft] = useState('');
  const [chatSender, setChatSender] = useState<'fournisseur' | 'projet'>('fournisseur');
  const [socket, setSocket] = useState<Socket | null>(null);
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
          lot.articles.map(a => ({
            id: a.id,
            code: `REF-${a.articleId || a.id}`,
            label: a.description,
            unit: a.unite || 'U',
            qty: a.quantite || 0,
            price: a.prixUnitaire && a.prixUnitaire > 0 ? a.prixUnitaire : '',
            discount: a.rabais || 0,
            catalogPrice: 0,
            statusInterne: a.status,
            motifRefusInterne: a.motifRefusInterne,
            descriptionRefusInterne: a.descriptionRefusInterne,
            dateChiffrage: a.dateChiffrage
          }))
        ) || [];
        setArticles(allArticles);
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
          if (data.success && data.data.docs) {
            setChatMessages(data.data.docs.reverse().map((m: any) => ({
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

    const newSocket = io(getNotificationBackendURL(), {
      transports: ['websocket'],
      auth: { token }
    });
    
    newSocket.on('connect', () => newSocket.emit('join-room', roomId));
    newSocket.on('chat-message', (m: any) => {
      setChatMessages(prev => [...prev, {
        id: m._id || Date.now(),
        from: m.senderType === 'FOURNISSEUR' ? 'fournisseur' : 'projet',
        message: m.message,
        time: new Date(m.createdAt || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        senderName: m.senderName
      }]);
    });
    
    setSocket(newSocket);
    return () => { newSocket.disconnect(); };
  }, [id, user, roomId]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handlePriceChange = (artId: number, value: string) => {
    setArticles(a => a.map(art => 
      art.id === artId 
        ? { 
            ...art, 
            price: value.trim() === '' ? '' : Number(value), 
            statusInterne: value.trim() === '' ? 'en_attente_chiffrage' : 'chiffre' 
          } 
        : art
    ));
  };

  const handleDiscountChange = (artId: number, value: string) => {
    setArticles(a => a.map(art => art.id === artId ? { ...art, discount: Math.max(0, Math.min(100, parseFloat(value) || 0)) } : art));
  };

  const applyCatalogPrice = (artId: number, catalogPrice: number) => handlePriceChange(artId, String(catalogPrice));

  const filteredArticles = useMemo(() => articles.filter(a => {
    const matchesSearch = a.label.toLowerCase().includes(searchTerm.toLowerCase()) || a.code.toLowerCase().includes(searchTerm.toLowerCase());
    const isPending = a.statusInterne === 'Non chiffré' || a.statusInterne === 'Non chiffre' || a.price === '';
    return matchesSearch && (filterMissing ? isPending : true);
  }), [articles, searchTerm, filterMissing]);

  const totalHT = useMemo(() => articles.reduce((sum, a) => sum + a.qty * (typeof a.price === 'number' ? a.price : 0), 0), [articles]);
  const missingCount = articles.filter(a => a.statusInterne === 'en_attente_chiffrage' || a.price === '').length;
  const completionRate = articles.length > 0 ? ((articles.length - missingCount) / articles.length * 100).toFixed(0) : '0';
  const isTermine = projet?.status === 'termine';

  const handleSave = async () => {
    if (!projet) return;
    setIsSaving(true);
    try {
      for (const a of articles) {
        if (typeof a.price === 'number' && a.price > 0) {
          await chiffrerArticle(a.id, { prixUnitaire: a.price, tva: 20, rabais: a.discount || 0, remarque: '' });
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
    try {
      await handleSave();
      await soumettreDevis(projet.id, user.nomEntreprise || 'Fournisseur');
      navigate('/chiffrage/demandes');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleFileUpload = async (articleId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(articleId);
    try {
      const uploaded = await uploadArticleFichier(articleId, file);
      setArticles(prev => prev.map(a => {
        if (a.id === articleId) {
          const newFiles = [...(a.files || []), { name: uploaded.nomFichier, size: `${(uploaded.taille / 1024).toFixed(0)} KB`, url: uploaded.url }];
          return { ...a, files: newFiles };
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
        setArticles(a => a.map(art => art.id === signalModal.targetId ? { ...art, statusInterne: 'signale', price: 0 } : art));
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
          {!isTermine && (
            <div className="d-flex gap-2">
              <button className="btn btn-outline-danger btn-sm px-3 rounded-pill shadow-sm fw-bold border" onClick={() => setSignalModal({ isOpen: true, type: 'projet' })}>
                <i className="fi fi-rr-cross-circle me-1"></i> Refuser la demande
              </button>
              <button className="btn btn-outline-secondary btn-sm px-3 rounded-pill bg-white shadow-sm fw-bold" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="fi fi-rr-disk me-1"></i>} 
                Sauvegarder
              </button>
              <button className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm fw-bold border-0" style={{ backgroundColor: '#316AFF' }} onClick={handleSubmitDevis} disabled={isSaving || missingCount > 0}>
                <i className="fi fi-rr-paper-plane me-1"></i> Envoyer le Devis
              </button>
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
                <thead className="bg-light bg-opacity-50">
                  <tr className="small text-muted text-uppercase fw-bold">
                    <th className="px-4 py-3" style={{ width: '120px' }}>Ref</th>
                    <th className="py-3">Article & Specs</th>
                    <th className="py-3 text-center">Quantité</th>
                    <th className="py-3" style={{ width: '170px' }}>Prix Unitaire HT</th>
                    <th className="py-3" style={{ width: '140px' }}>Rabais</th>
                    <th className="px-4 py-3 text-end" style={{ width: '160px' }}>Total HT (€)</th>
                    <th className="px-4 py-3 text-center" style={{ width: '130px' }}>Action</th>
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
                            {(a.statusInterne === 'en_attente_chiffrage' || a.price === '') && !isTermine && (
                                <span className="badge bg-warning text-dark px-2 py-0.5 rounded-pill" style={{ fontSize: '9px' }}>Non chiffré</span>
                            )}
                            {a.statusInterne === 'chiffre' && !isTermine && (
                                <span className="badge bg-success text-white px-2 py-0.5 rounded-pill" style={{ fontSize: '9px' }}>Chiffré</span>
                            )}
                            {a.statusInterne === 'signale' && !isTermine && (
                                <span className="badge bg-danger text-white px-2 py-0.5 rounded-pill" style={{ fontSize: '9px' }}>Signalé</span>
                            )}
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
                            <input type="number" className={`form-control form-control-sm text-end fw-bold pe-4 bg-light border-0 rounded-3 ${a.price > 0 ? 'text-success' : 'text-danger'}`}
                              value={a.price === '' ? '' : a.price} placeholder="0.00"
                              onChange={(e) => handlePriceChange(a.id, e.target.value)} 
                              disabled={isTermine}
                            />
                            <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-muted" style={{ fontSize: '0.75rem' }}>€</span>
                          </div>
                          {a.catalogPrice > 0 && a.price === '' && !isTermine && (
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
                              className="form-control form-control-sm text-end fw-bold pe-4 bg-light border-0 rounded-3"
                              value={a.discount === 0 ? '' : a.discount}
                              placeholder="0.00"
                              min={0}
                              max={100}
                              onChange={(e) => handleDiscountChange(a.id, e.target.value)}
                              disabled={isTermine}
                            />
                            <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-muted" style={{ fontSize: '0.75rem' }}>%</span>
                          </div>
                        </td>
                        <td className="px-4 text-end">
                          <span className={`fw-extrabold ${typeof a.price === 'number' && a.price > 0 ? 'text-dark' : 'text-muted'}`}>
                            {(a.qty * (typeof a.price === 'number' ? a.price : 0) * (1 - (a.discount || 0) / 100)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                          </span>
                        </td>
                        <td className="px-4 text-center">
                          {!isTermine && (
                            <div className="d-inline-flex align-items-center gap-2">
                              <button
                                type="button"
                                className="btn btn-sm p-0 border-0 bg-transparent text-warning"
                                title="Signaler un problème sur cet article"
                                onClick={() => setSignalModal({ isOpen: true, targetId: a.id, type: 'article' })}
                              >
                                <i className="fi fi-rr-exclamation" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm p-0 border-0 bg-transparent text-primary"
                                title="Voir le document"
                                onClick={() => {
                                  if (a.files && a.files[0]?.url) {
                                    window.open(a.files[0].url, '_blank', 'noopener,noreferrer');
                                  }
                                }}
                              >
                                <i className="fi fi-rr-link" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm p-0 border-0 bg-transparent text-info"
                                title="Détails"
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
                      </tr>
                      {expandedArticle === a.id && (
                        <tr className="bg-primary bg-opacity-10 animate__animated animate__fadeIn">
                          <td colSpan={5} className="px-4 py-3 border-top-0">
                            <div className="row g-4">
                              <div className="col-md-7">
                                <h6 className="small fw-extrabold text-primary mb-2">Description Technique</h6>
                                <p className="text-muted small mb-0 lh-base">{a.description}</p>
                              </div>
                              <div className="col-md-5">
                                <h6 className="small fw-extrabold text-primary mb-2">Documents</h6>
                                <div className="vstack gap-2">
                                  {a.files.map((f, idx) => (
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
                                  <div className="mt-2">
                                    <label className={`btn btn-sm btn-outline-primary rounded-pill px-3 shadow-sm ${isUploading === a.id ? 'disabled' : ''}`}>
                                      {isUploading === a.id ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="fi fi-rr-upload me-1"></i>}
                                      Joindre un document (Devis/Plan)
                                      <input type="file" className="d-none" onChange={(e) => handleFileUpload(a.id, e)} disabled={isUploading === a.id} />
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
          <div
            className="card border-0 shadow-sm rounded-4 bg-white offer-summary-sticky"
          >
            <div className="card-header bg-transparent border-bottom p-4">
              <h5 className="fw-extrabold mb-0 text-dark">Résumé Offre</h5>
            </div>
            <div className="card-body p-4 text-start">
              <div className="text-center mb-4 p-4 bg-primary bg-opacity-10 rounded-4">
                <small className="text-primary fw-bold d-block mb-1" style={{ fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>TOTAL HT</small>
                <h2 className="fw-extrabold text-primary mb-0">{totalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</h2>
              </div>
              <div className="vstack gap-3 mb-4">
                <div className="d-flex justify-content-between"><span className="text-muted small">Articles à chiffrer</span><span className="fw-bold">{articles.length}</span></div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Restants</span>
                  <span className={`badge rounded-pill ${missingCount > 0 ? 'bg-warning text-dark' : 'bg-success text-white'} fw-bold`}>{missingCount} articles</span>
                </div>
                <hr className="my-1 border-light" />
                <div className="d-flex justify-content-between"><span className="text-muted small">TVA (20%)</span><span className="fw-bold">{(totalHT * 0.2).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span></div>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-muted fw-bold">PROGRESSION</small>
                  <small className="fw-extrabold text-primary">{completionRate}%</small>
                </div>
                <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                  <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" style={{ width: `${completionRate}%` }}></div>
                </div>
              </div>
              <div className="p-3 bg-light rounded-3 border">
                <h6 className="small fw-extrabold text-dark mb-2" style={{ textTransform: 'uppercase' }}>Notes Client</h6>
                <p className="text-muted small mb-0 lh-sm">"Merci de privilégier les matériaux de marques NF. Livraison attendue sur site."</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chat interne entre l'équipe fournisseur et l'équipe projet ── */}
      <div className="row g-4 mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 bg-white">
            <div className="card-header border-0 bg-transparent d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-extrabold mb-1 text-dark">Espace d’échange interne</h5>
                <p className="text-muted small mb-0">
                  Discussion entre <strong>l’équipe Fournisseur</strong> et <strong>l’équipe Projet</strong> pour le dossier #{id}.
                </p>
              </div>
              <span className="badge bg-primary-subtle text-primary small">
                <i className="fi fi-rr-comments me-1" /> Chat interne
              </span>
            </div>
            <div className="card-body border-top pt-3" style={{ maxHeight: 320, overflowY: 'auto' }}>
              <div className="vstack gap-3">
                {chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`d-flex ${m.from === 'fournisseur' ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    {m.from === 'projet' && (
                      <div className="me-2">
                        <div className="avatar avatar-xs rounded-circle bg-info text-white d-flex align-items-center justify-content-center">
                          <i className="fi fi-rr-briefcase"></i>
                        </div>
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-4 shadow-sm small ${
                        m.from === 'fournisseur'
                          ? 'bg-primary text-white'
                          : 'bg-light text-dark'
                      }`}
                      style={{ maxWidth: '75%' }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold">
                          {m.senderName ? m.senderName : (m.from === 'fournisseur' ? "Équipe Fournisseur" : "Équipe Projet")}
                        </span>
                        <span className={`ms-2 text-2xs ${m.from === 'fournisseur' ? 'text-white-50' : 'text-muted'}`}>
                          {m.time}
                        </span>
                      </div>
                      <div className="mb-0">{m.message}</div>
                    </div>
                    {m.from === 'fournisseur' && (
                      <div className="ms-2">
                        <div className="avatar avatar-xs rounded-circle bg-success text-white d-flex align-items-center justify-content-center">
                          <i className="fi fi-rr-users"></i>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {chatMessages.length === 0 && (
                  <div className="text-center text-muted small py-4">
                    <i className="fi fi-rr-comments text-primary fs-4 d-block mb-2" />
                    Aucune conversation pour le moment. Démarrez l’échange pour ce chiffrage.
                  </div>
                )}
                <div ref={chatScrollRef} />
              </div>
            </div>
            <div className="card-footer border-0 bg-light-subtle">
              <div className="row g-2 align-items-center">
                <div className="col-md-3">
                  <select
                    className="form-select form-select-sm rounded-3"
                    value={chatSender}
                    onChange={(e) => setChatSender(e.target.value as 'fournisseur' | 'projet')}
                  >
                    <option value="fournisseur">Équipe Fournisseur</option>
                    <option value="projet">Équipe Projet</option>
                  </select>
                </div>
                <div className="col-md-7">
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3"
                    placeholder="Écrire un message interne lié à ce chiffrage…"
                    value={chatDraft}
                    onChange={(e) => setChatDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <div className="col-md-2 d-grid">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm rounded-3 fw-bold"
                    onClick={handleSendMessage}
                  >
                    <i className="fi fi-rr-paper-plane me-1"></i> Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Timeline Modal */}
      {timelineModal.isOpen && timelineModal.article && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000 }}>
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
                  {[
                    { label: 'Reçu', date: projet.dateEnvoi, desc: 'Consultation reçue dans le portail fournisseur', icon: 'fi-rr-inbox-in' },
                    { label: 'En cours de chiffrage', date: projet.dateEnvoi, desc: 'Ouverture du dossier et début de saisie des prix', icon: 'fi-rr-edit' },
                    { label: 'Chiffré et envoyé', date: timelineModal.article.dateChiffrage || projet.dateRetour, desc: 'Montant validé et transmis à l’équipe projet', icon: 'fi-rr-check' },
                    { label: 'En attente de réponse', date: projet.dateRetour, desc: 'Analyse par le bureau d’étude interne', icon: 'fi-rr-hourglass' },
                    { 
                        label: timelineModal.article.statusInterne === 'valide' ? 'Accepté' : timelineModal.article.statusInterne === 'rejete' ? 'Refusé' : 'Décision en cours', 
                        date: projet.dateRetour, 
                        desc: timelineModal.article.motifRefusInterne 
                            ? `${timelineModal.article.motifRefusInterne}${timelineModal.article.descriptionRefusInterne ? ` : ${timelineModal.article.descriptionRefusInterne}` : ''}`
                            : (timelineModal.article.statusInterne === 'valide' ? 'Votre offre a été retenue pour cet article.' : 'En attente de validation finale.'),
                        icon: timelineModal.article.statusInterne === 'valide' ? 'fi-rr-following' : timelineModal.article.statusInterne === 'rejete' ? 'fi-rr-cross' : 'fi-rr-search-alt',
                        highlight: timelineModal.article.statusInterne === 'valide' ? 'success' : timelineModal.article.statusInterne === 'rejete' ? 'danger' : 'primary'
                    },
                    { label: 'Terminé', date: projet.status === 'termine' ? projet.dateRetour : '--', desc: 'Clôture de la phase de consultation', icon: 'fi-rr-flag' },
                  ].map((stage, idx) => (
                    <div key={idx} className="mb-4 position-relative">
                      {/* Timeline Dot */}
                      <div 
                        className={`position-absolute rounded-pill d-flex align-items-center justify-content-center text-white shadow-sm transition-all hover:scale-110`}
                        style={{
                          left: '-44px',
                          top: '0',
                          width: '36px',
                          height: '36px',
                          backgroundColor: stage.highlight === 'success' ? '#10b981' : stage.highlight === 'danger' ? '#ef4444' : (idx < 5 ? '#316AFF' : '#cbd5e1'),
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Signal Modal */}
      {signalModal.isOpen && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1050 }}>
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

      <style>{`
        .fw-extrabold { font-weight: 800; }
        .letter-spacing-1 { letter-spacing: 0.05em; }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
}
