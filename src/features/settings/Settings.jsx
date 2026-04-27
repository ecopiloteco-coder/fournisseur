import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { getMyProfile, updateMyProfile, getMyEntreprise, updateMyEntreprise, getMyAbonnement } from './settingsService.js';
import { useAuth } from '../../shared/providers/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getBackendURL } from '../../shared/lib/api-bridge';
// ─── Helpers ──────────────────────────────────────────────────────────────────
const InputField = ({ label, name, value, onChange, type = 'text', readOnly = false, required = false }) => (
    <div className="mb-4">
        <label className="form-label small fw-bold text-dark mb-1">{label}{required && <span className="text-danger ms-1">*</span>}</label>
        <div className="position-relative">
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                readOnly={readOnly}
                className="form-control border-0 rounded-3 py-2 px-3"
                style={{ backgroundColor: readOnly ? '#EAEEF6' : '#F3F6FC', fontSize: '13px', color: readOnly ? '#888' : '#333' }}
            />
            {!readOnly && onChange && (
                <i className="fi fi-rr-edit text-primary position-absolute top-50 translate-middle-y end-0 me-3" style={{ fontSize: '12px' }}></i>
            )}
        </div>
    </div>
);

const AbonnementBadge = ({ status }) => {
    const colors = {
        actif: { bg: '#E8F5E9', text: '#2E7D32', label: 'Actif' },
        inactif: { bg: '#FDECEA', text: '#C62828', label: 'Inactif' },
        en_attente: { bg: '#FFF8E1', text: '#F57F17', label: 'En attente' },
    };
    const s = colors[status] || colors['en_attente'];
    return (
        <span className="badge fw-semibold px-3 py-2 rounded-pill" style={{ backgroundColor: s.bg, color: s.text, fontSize: '13px' }}>
            {s.label}
        </span>
    );
};

const PackLabel = ({ type }) => {
    const labels = { essai: 'Essai Pro (14 jours)', pack: 'Pack Mensuel', premium: 'Premium Annuel' };
    return <span>{labels[type] || type}</span>;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Settings() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('profil');

    // Profil state
    const [profil, setProfil] = useState({ 
        nom_utilisateur: user?.nom || user?.nomContact || '', 
        prenom: user?.prenom || '', 
        email: user?.email || '', 
        telephone: user?.telephone || '', 
        role: user?.role || '' 
    });
    const [profilLoading, setProfilLoading] = useState(true);
    const [profilSaving, setProfilSaving] = useState(false);

    // Entreprise state
    const [entreprise, setEntreprise] = useState({ 
        nomEntreprise: user?.nomEntreprise || '', 
        email: '', 
        telephone: '', 
        adresse: '', 
        categorie: '', 
        siteWeb: '',
        lots: [],
        dateCreation: '' 
    });
    const [entrepriseLoading, setEntrepriseLoading] = useState(true);
    const [entrepriseSaving, setEntrepriseSaving] = useState(false);
    const [isAdmin, setIsAdmin] = useState(user?.role === 'ADMIN_FOURNISSEUR' || user?.role === 'Administrateur Fournisseur');

    // Abonnement state
    const [abonnement, setAbonnement] = useState(null);
    const [abonnementLoading, setAbonnementLoading] = useState(true);

    useEffect(() => {
        // Load profil
        getMyProfile()
            .then(data => {
                setProfil(prev => ({
                    nom_utilisateur: data.nom_utilisateur || data.nom || prev.nom_utilisateur,
                    prenom: data.prenom || prev.prenom,
                    email: data.email || prev.email,
                    telephone: data.telephone || prev.telephone,
                    role: data.role || prev.role,
                }));
                setIsAdmin(data.role === 'ADMIN_FOURNISSEUR' || data.role === 'Administrateur Fournisseur');
            })
            .catch(() => toast.error('Impossible de charger le profil'))
            .finally(() => setProfilLoading(false));

        // Load entreprise
        getMyEntreprise()
            .then(data => setEntreprise(prev => ({ ...prev, ...(data || {}) })))
            .catch(() => {})
            .finally(() => setEntrepriseLoading(false));

        // Load abonnement
        getMyAbonnement()
            .then(data => setAbonnement(data))
            .catch(() => {})
            .finally(() => setAbonnementLoading(false));
    }, []);

    useEffect(() => {
        const confirmPaymentIfNeeded = async () => {
            const params = new URLSearchParams(location.search);
            const payment = params.get('payment');
            const sessionId = params.get('session_id');

            if (payment === 'cancel') {
                Swal.fire({
                    title: 'Annulé',
                    text: 'Le processus de paiement a été annulé.',
                    icon: 'info',
                    confirmButtonColor: '#0978E8'
                });
                navigate('/settings', { replace: true });
                return;
            }

            if (payment === 'success' && sessionId) {
                try {
                    Swal.fire({
                        title: 'Vérification...',
                        text: 'Confirmation de votre abonnement en cours',
                        allowOutsideClick: false,
                        didOpen: () => Swal.showLoading()
                    });

                    const res = await fetch(`${getBackendURL()}/api/fournisseurs/abonnements/confirm-session?sessionId=${encodeURIComponent(sessionId)}`, {
                        method: 'POST'
                    });

                    if (!res.ok) throw new Error('Impossible de confirmer le paiement');

                    // Re-fetch abonnement to get updated state
                    const updatedAbonnement = await getMyAbonnement();
                    setAbonnement(updatedAbonnement);
                    setActiveTab('abonnement');

                    Swal.fire({
                        title: 'Félicitations !',
                        text: 'Votre abonnement a été mis à jour avec succès.',
                        icon: 'success',
                        confirmButtonColor: '#0978E8'
                    });
                } catch (err) {
                    Swal.fire({
                        title: 'Erreur',
                        text: err.message || 'La vérification du paiement a échoué.',
                        icon: 'error',
                        confirmButtonColor: '#d33'
                    });
                } finally {
                    navigate('/settings', { replace: true });
                }
            }
        };

        confirmPaymentIfNeeded();
    }, [location.search, navigate]);

    const handleProfilChange = (e) => {
        const { name, value } = e.target;
        setProfil(prev => ({ ...prev, [name]: value }));
    };

    const handleEntrepriseChange = (e) => {
        const { name, value } = e.target;
        setEntreprise(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfil = async () => {
        setProfilSaving(true);
        try {
            await updateMyProfile({ nom_utilisateur: profil.nom_utilisateur, prenom: profil.prenom, telephone: profil.telephone });
            Swal.fire({
                title: 'Succès !',
                text: 'Votre profil a été mis à jour avec succès.',
                icon: 'success',
                confirmButtonColor: '#0978E8',
                confirmButtonText: 'Terminer',
                customClass: {
                    popup: 'rounded-4 shadow-sm border-0'
                }
            });
        } catch (err) {
            Swal.fire({
                title: 'Erreur',
                text: err.message || 'La modification a échoué. Veuillez réessayer.',
                icon: 'error',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Fermer',
                customClass: {
                    popup: 'rounded-4 shadow-sm border-0'
                }
            });
        } finally {
            setProfilSaving(false);
        }
    };

    const handleSaveEntreprise = async () => {
        setEntrepriseSaving(true);
        try {
            const updated = await updateMyEntreprise({
                nomEntreprise: entreprise.nomEntreprise,
                telephone: entreprise.telephone,
                adresse: entreprise.adresse,
                categorie: entreprise.categorie,
                siteWeb: entreprise.siteWeb,
            });
            setEntreprise(updated.data || entreprise);
            Swal.fire({
                title: 'Succès !',
                text: 'Les informations de l\'entreprise ont été mises à jour.',
                icon: 'success',
                confirmButtonColor: '#0978E8',
                confirmButtonText: 'Terminer',
                customClass: {
                    popup: 'rounded-4 shadow-sm border-0'
                }
            });
        } catch (err) {
            Swal.fire({
                title: 'Erreur',
                text: err.message || 'La modification de l\'entreprise a échoué. Veuillez réessayer.',
                icon: 'error',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Fermer',
                customClass: {
                    popup: 'rounded-4 shadow-sm border-0'
                }
            });
        } finally {
            setEntrepriseSaving(false);
        }
    };

    const tabs = [
        { key: 'profil', label: 'Mon profil', icon: 'fi-rr-user' },
        { key: 'entreprise', label: 'Entreprise', icon: 'fi-rr-building' },
        { key: 'abonnement', label: 'Abonnement', icon: 'fi-rr-credit-card' },
        { key: 'notifications', label: 'Notifications', icon: 'fi-rr-bell' },
    ];

    return (
        <div className="container-fluid pb-5">
            <div className="mb-4 text-start">
                <h4 className="fw-black text-dark mb-1" style={{ color: '#1B2A4E', fontSize: '20px' }}>Paramètre</h4>
                <p className="text-muted small mb-0">Gérez votre profil, votre entreprise et vos préférences.</p>
            </div>

            <div className="bg-white rounded-3 shadow-sm p-4 d-flex align-items-start text-start" style={{ minHeight: '600px' }}>
                {/* Sidebar */}
                <div style={{ width: '220px' }} className="flex-shrink-0">
                    <ul className="nav flex-column gap-2">
                        {tabs.map(tab => (
                            <li key={tab.key} className="nav-item">
                                <button
                                    className={`nav-link w-100 text-start rounded-pill py-2 px-3 fw-bold d-flex align-items-center gap-2 ${activeTab === tab.key ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted'}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    <i className={`fi ${tab.icon}`} style={{ fontSize: '14px' }}></i>
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content */}
                <div className="flex-grow-1 ps-5 pe-4 w-100">

                    {/* ─── PROFIL ─────────────────────────────────────────────── */}
                    {activeTab === 'profil' && (
                        <div className="d-flex flex-column align-items-center w-100 mx-auto" style={{ maxWidth: '560px' }}>
                            <div className="position-relative mb-4 mt-2">
                                <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary fw-bold"
                                    style={{ width: '80px', height: '80px', fontSize: '28px' }}>
                                    {profil.nom_utilisateur ? profil.nom_utilisateur[0].toUpperCase() : '?'}
                                </div>
                            </div>

                            {profilLoading ? (
                                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                            ) : (
                                <form className="w-100 text-start" onSubmit={e => { e.preventDefault(); handleSaveProfil(); }}>
                                    <div className="row g-3 mb-2">
                                        <div className="col-6">
                                            <InputField label="Nom" name="nom_utilisateur" value={profil.nom_utilisateur} onChange={handleProfilChange} required />
                                        </div>
                                        <div className="col-6">
                                            <InputField label="Prénom" name="prenom" value={profil.prenom} onChange={handleProfilChange} />
                                        </div>
                                    </div>
                                    <InputField label="Téléphone" name="telephone" value={profil.telephone} onChange={handleProfilChange} />
                                    <InputField label="Email" name="email" value={profil.email} readOnly />
                                    <InputField label="Rôle" name="role" value={profil.role === 'ADMIN_FOURNISSEUR' ? 'Administrateur Fournisseur' : profil.role} readOnly />

                                    <div className="text-center mt-4">
                                        <button type="submit" className="btn text-white fw-bold px-5 py-2 rounded-pill shadow-sm"
                                            style={{ backgroundColor: '#0978E8', fontSize: '14px' }} disabled={profilSaving}>
                                            {profilSaving ? <><span className="spinner-border spinner-border-sm me-2"></span>Enregistrement...</> : 'Enregistrer'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* ─── ENTREPRISE ──────────────────────────────────────────── */}
                    {activeTab === 'entreprise' && (
                        <div className="d-flex flex-column w-100 mx-auto" style={{ maxWidth: '560px' }}>
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold"
                                    style={{ width: '50px', height: '50px', fontSize: '20px' }}>
                                    <i className="fi fi-rr-building"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">{entreprise.nomEntreprise || '—'}</h6>
                                    {entreprise.dateCreation && (
                                        <small className="text-muted">Membre depuis le {new Date(entreprise.dateCreation).toLocaleDateString('fr-FR')}</small>
                                    )}
                                </div>
                            </div>

                            {entrepriseLoading ? (
                                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                            ) : (
                                <form className="w-100 text-start" onSubmit={e => { e.preventDefault(); handleSaveEntreprise(); }}>
                                    <InputField label="Nom de l'entreprise" name="nomEntreprise" value={entreprise.nomEntreprise} onChange={isAdmin ? handleEntrepriseChange : null} readOnly={!isAdmin} />
                                    <InputField label="Email" name="email" value={entreprise.email} readOnly />
                                    <InputField label="Téléphone" name="telephone" value={entreprise.telephone} onChange={isAdmin ? handleEntrepriseChange : null} readOnly={!isAdmin} />
                                    <InputField label="Adresse" name="adresse" value={entreprise.adresse} onChange={isAdmin ? handleEntrepriseChange : null} readOnly={!isAdmin} />
                                    <InputField label="Site Web" name="siteWeb" value={entreprise.siteWeb} onChange={isAdmin ? handleEntrepriseChange : null} readOnly={!isAdmin} />
                                    <InputField label="Catégorie" name="categorie" value={entreprise.categorie} readOnly />

                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-dark mb-2">Lots de travaux</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {entreprise.lots && entreprise.lots.length > 0 ? (
                                                entreprise.lots.map(lot => (
                                                    <span key={lot.id} className="badge bg-light text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill fw-semibold" style={{ fontSize: '12px' }}>
                                                        {lot.label}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-muted small italic">Aucun lot sélectionné</span>
                                            )}
                                        </div>
                                    </div>

                                    {isAdmin && (
                                        <div className="text-center mt-4">
                                            <button type="submit" className="btn text-white fw-bold px-5 py-2 rounded-pill shadow-sm"
                                                style={{ backgroundColor: '#0978E8', fontSize: '14px' }} disabled={entrepriseSaving}>
                                                {entrepriseSaving ? <><span className="spinner-border spinner-border-sm me-2"></span>Enregistrement...</> : 'Enregistrer'}
                                            </button>
                                        </div>
                                    )}
                                    {!isAdmin && (
                                        <div className="alert alert-info small border-0 rounded-3 mt-2" style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                                            <i className="fi fi-rr-info me-2"></i>
                                            Seul l'administrateur peut modifier les informations de l'entreprise.
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>
                    )}

                    {/* ─── ABONNEMENT ──────────────────────────────────────────── */}
                    {activeTab === 'abonnement' && (
                        <div className="d-flex align-items-start justify-content-center" style={{ minHeight: '400px', paddingTop: '20px' }}>
                            {abonnementLoading ? (
                                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                            ) : abonnement ? (
                                <div className="p-4 rounded-4 w-100" style={{ border: '1px dashed #A0C6FF', backgroundColor: '#F8FBFF', maxWidth: '480px' }}>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h6 className="fw-bold mb-0" style={{ color: '#1B2A4E' }}>Récapitulatif de l'abonnement</h6>
                                        <AbonnementBadge status={abonnement.status} />
                                    </div>
                                    <ul className="list-unstyled mb-0" style={{ fontSize: '14px' }}>
                                        <li className="d-flex justify-content-between border-bottom py-2">
                                            <span className="text-muted">Pack</span>
                                            <span className="fw-semibold"><PackLabel type={abonnement.typeAbonnement} /></span>
                                        </li>
                                        <li className="d-flex justify-content-between border-bottom py-2">
                                            <span className="text-muted">Date de début</span>
                                            <span className="fw-semibold">{abonnement.dateDebut ? new Date(abonnement.dateDebut).toLocaleDateString('fr-FR') : '—'}</span>
                                        </li>
                                        <li className="d-flex justify-content-between py-2">
                                            <span className="text-muted">Date d'échéance</span>
                                            <span className="fw-semibold">{abonnement.dateFin ? new Date(abonnement.dateFin).toLocaleDateString('fr-FR') : '—'}</span>
                                        </li>
                                    </ul>
                                    {isAdmin && (
                                        <div className="text-center mt-4 pt-3 border-top">
                                            <button 
                                                className="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow-sm"
                                                onClick={() => navigate('/pages/pricing')}
                                            >
                                                <i className="fi fi-rr-rocket me-2"></i> Mettre à niveau
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-muted py-5">
                                    <i className="fi fi-rr-credit-card" style={{ fontSize: '40px', opacity: 0.3 }}></i>
                                    <p className="mt-3">Aucun abonnement actif trouvé.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ─── NOTIFICATIONS ───────────────────────────────────────── */}
                    {activeTab === 'notifications' && (
                        <div className="d-flex flex-column w-100 mx-auto" style={{ maxWidth: '560px', marginTop: '20px' }}>
                            <h5 className="fw-bold mb-4 text-start" style={{ color: '#1B2A4E' }}>Demandes & Devis</h5>
                            {[
                                { label: 'Nouvelle demande reçue', defaultChecked: true },
                                { label: 'Rappel des demandes non répondues', defaultChecked: false },
                                { label: 'Devis accepté', defaultChecked: true },
                                { label: 'Devis refusé', defaultChecked: false },
                                { label: "Date d'échéance proche", defaultChecked: false },
                                { label: 'Rappel de mise à jour des prix', defaultChecked: false },
                            ].map((item, i) => (
                                <div key={i} className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="small fw-semibold text-dark">{item.label}</span>
                                    <div className="form-check form-switch pe-0">
                                        <input className="form-check-input" type="checkbox" role="switch"
                                            defaultChecked={item.defaultChecked}
                                            style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                                    </div>
                                </div>
                            ))}
                            <div className="text-center mt-4">
                                <button type="button" className="btn text-white fw-bold px-5 py-2 rounded-pill shadow-sm"
                                    style={{ backgroundColor: '#0978E8', fontSize: '14px' }}
                                    onClick={() => toast.success('Préférences enregistrées')}>
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
