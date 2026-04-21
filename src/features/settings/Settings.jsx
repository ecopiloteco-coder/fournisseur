import React, { useState } from 'react';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profil');

    return (
        <div className="container-fluid pb-5">
            <div className="mb-4 text-start">
                <h4 className="fw-black text-dark mb-1" style={{ color: '#1B2A4E', fontSize: '20px' }}>Paramètre</h4>
                <p className="text-muted small mb-0">Une expertise reconnue pour améliorer la gestion des coûts et la performance des projets BTP.</p>
            </div>

            <div className="bg-white rounded-3 shadow-sm p-4 d-flex align-items-start text-start" style={{ minHeight: '600px' }}>
                {/* Sidebar (Onglets) */}
                <div style={{ width: '220px' }} className="flex-shrink-0">
                    <ul className="nav flex-column gap-2">
                        <li className="nav-item">
                            <button 
                                className={`nav-link w-100 text-start rounded-pill py-2 px-3 fw-bold ${activeTab === 'profil' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('profil')}
                            >
                                Mon profil
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link w-100 text-start rounded-pill py-2 px-3 fw-bold ${activeTab === 'abonnement' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('abonnement')}
                            >
                                Abonnement
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link w-100 text-start rounded-pill py-2 px-3 fw-bold ${activeTab === 'notifications' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('notifications')}
                            >
                                Notifications
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Contenu Principal */}
                <div className="flex-grow-1 ps-5 pe-4 w-100">
                    {/* ONGLET : MON PROFIL */}
                    {activeTab === 'profil' && (
                        <div className="d-flex flex-column align-items-center w-100 mx-auto" style={{ maxWidth: '600px' }}>
                            {/* Avatar */}
                            <div className="position-relative mb-5 mt-2">
                                <div className="rounded-circle" style={{ width: '80px', height: '80px', backgroundColor: '#F8FAFC', border: '1px dashed #ced4da', backgroundImage: 'radial-gradient(#E8ECF4 15%, transparent 15%)', backgroundSize: '8px 8px' }}></div>
                                <div className="position-absolute bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', bottom: '0', right: '-4px', border: '2px solid white' }}>
                                    <i className="fi fi-rr-camera small" style={{ fontSize: '10px' }}></i>
                                </div>
                            </div>

                            <form className="w-100 text-start">
                                {/* Nom et Prénom */}
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-dark mb-2">Nom et Prénom</label>
                                    <div className="position-relative">
                                        <input type="text" className="form-control border-0 rounded-3 py-2 px-3" style={{ backgroundColor: '#F3F6FC', fontSize: '13px' }} placeholder="Entrer votre nom et prénom" />
                                        <i className="fi fi-rr-edit text-primary position-absolute top-50 translate-middle-y end-0 me-3"></i>
                                    </div>
                                </div>

                                {/* Téléphone */}
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-dark mb-2">Téléphone</label>
                                    <div className="position-relative">
                                        <input type="text" className="form-control border-0 rounded-3 py-2 px-3" style={{ backgroundColor: '#F3F6FC', fontSize: '13px' }} placeholder="Entrer votre téléphone" />
                                        <i className="fi fi-rr-edit text-primary position-absolute top-50 translate-middle-y end-0 me-3"></i>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-dark mb-2">Email</label>
                                    <div className="position-relative">
                                        <input type="email" className="form-control border-0 rounded-3 py-2 px-3" style={{ backgroundColor: '#F3F6FC', fontSize: '13px' }} placeholder="Entrer votre email" />
                                    </div>
                                </div>

                                {/* Mot de passe */}
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-dark mb-2">Mot de passe</label>
                                    <div className="position-relative">
                                        <input type="password" className="form-control border-0 rounded-3 py-2 px-3" style={{ backgroundColor: '#F3F6FC', fontSize: '13px' }} defaultValue="*************" />
                                        <i className="fi fi-rr-edit text-primary position-absolute top-50 translate-middle-y end-0 me-3"></i>
                                    </div>
                                </div>

                                {/* Rôle */}
                                <div className="mb-5">
                                    <label className="form-label small fw-bold text-dark mb-2">Rôle</label>
                                    <div className="position-relative">
                                        <input type="text" className="form-control border-0 rounded-3 py-2 px-3" style={{ backgroundColor: '#F3F6FC', fontSize: '13px' }} placeholder="Entrer votre rôle" />
                                    </div>
                                </div>

                                {/* Bouton Enregistrer */}
                                <div className="text-center mt-2">
                                    <button type="button" className="btn text-white fw-bold px-5 py-2 rounded-pill shadow-sm" style={{ backgroundColor: '#6Cb2FF', fontSize: '14px' }}>
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ONGLET : ABONNEMENT */}
                    {activeTab === 'abonnement' && (
                        <div className="d-flex align-items-center justify-content-center h-100" style={{ minHeight: '400px' }}>
                            <div className="p-4 rounded-3" style={{ border: '1px dashed #A0C6FF', backgroundColor: '#F8FBFF', minWidth: '350px' }}>
                                <h6 className="fw-bold text-dark mb-3" style={{ color: '#1B2A4E' }}>Récapitulatif</h6>
                                <ul className="list-unstyled mb-0" style={{ fontSize: '14px' }}>
                                    <li className="d-flex align-items-center mb-2">
                                        <span className="me-2 text-dark">•</span> Pack choisi : Essai Pro
                                    </li>
                                    <li className="d-flex align-items-center mb-2">
                                        <span className="me-2 text-dark">•</span> Prix : 49 €
                                    </li>
                                    <li className="d-flex align-items-center">
                                        <span className="me-2 text-dark">•</span> Date d'échéance : 12 / 05 /2026
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* ONGLET : NOTIFICATIONS */}
                    {activeTab === 'notifications' && (
                        <div className="d-flex flex-column align-items-center w-100 mx-auto" style={{ maxWidth: '600px', marginTop: '20px' }}>
                            <div className="w-100 text-start mb-5">
                                <h5 className="fw-bold mb-4" style={{ color: '#1B2A4E' }}>Demandes & Devis</h5>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="small fw-semibold text-dark">Nouvelle demande reçue</span>
                                    <div className="form-check form-switch pe-0">
                                        <input className="form-check-input" type="checkbox" role="switch" defaultChecked style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="small fw-semibold text-dark">Rappel des demandes non répondues</span>
                                    <div className="form-check form-switch pe-0">
                                        <input className="form-check-input" type="checkbox" role="switch" style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="small fw-semibold text-dark">Devis accepté</span>
                                    <div className="form-check form-switch pe-0">
                                        <input className="form-check-input" type="checkbox" role="switch" defaultChecked style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="small fw-semibold text-dark">Devis refusé</span>
                                    <div className="form-check form-switch pe-0">
                                        <input className="form-check-input" type="checkbox" role="switch" style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="small fw-semibold text-dark">Date d'échéance proche</span>
                                    <div className="form-check form-switch pe-0">
                                        <input className="form-check-input" type="checkbox" role="switch" style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <span className="small fw-semibold text-dark">Rappel de mise à jour des prix</span>
                                    <div className="form-check form-switch pe-0">
                                        <input className="form-check-input" type="checkbox" role="switch" style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-4">
                                <button type="button" className="btn text-white fw-bold px-5 py-2 rounded-pill shadow-sm" style={{ backgroundColor: '#6Cb2FF', fontSize: '14px' }}>
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
