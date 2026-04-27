import React, { useState } from 'react';
import { getBackendURL } from '../../shared/lib/api-bridge';
import Swal from 'sweetalert2';

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState(null);

    const handleCheckout = async (type) => {
        setLoadingPlan(type);
        try {
            const token = sessionStorage.getItem('fournisseur_token');
            const res = await fetch(`${getBackendURL()}/api/fournisseurs/abonnements/checkout?type=${type}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success && data.data) {
                window.location.href = data.data; // Redirect to Stripe
            } else {
                throw new Error(data.message || 'Erreur lors de la création de la session de paiement');
            }
        } catch (err) {
            Swal.fire({
                title: 'Erreur',
                text: err.message,
                icon: 'error',
                confirmButtonColor: '#d33',
            });
            setLoadingPlan(null);
        }
    };

    const plans = [
        {
            name: 'Essai Gratuit',
            desc: 'Testez la plateforme pendant 15 jours sans engagement.',
            monthlyPrice: 0,
            yearlyPrice: 0,
            type: 'essai',
            features: [
                { name: 'Accès aux appels d\'offres', included: true },
                { name: 'Réponses aux chiffrages', included: true },
                { name: 'Support prioritaire', included: false },
                { name: 'Import catalogue massif', included: false },
                { name: 'Statistiques avancées', included: false },
            ]
        },
        {
            name: 'Pack Pro',
            desc: 'L\'essentiel pour développer votre chiffre d\'affaires.',
            monthlyPrice: 49,
            yearlyPrice: 490,
            popular: true,
            type: 'pack', // En mensuel, ou si on bascule en annuel, on peut garder type pack mais dans la vraie vie Stripe gère les récurrences. Ici on utilise type='pack' pour mensuel et type='premium' pour annuel selon votre demande.
            features: [
                { name: 'Accès aux appels d\'offres', included: true },
                { name: 'Réponses aux chiffrages', included: true },
                { name: 'Support standard', included: true },
                { name: 'Import catalogue massif', included: true },
                { name: 'Statistiques avancées', included: false },
            ]
        },
        {
            name: 'Premium',
            desc: 'La solution complète pour les grands fournisseurs.',
            monthlyPrice: 89,
            yearlyPrice: 890,
            type: 'premium',
            features: [
                { name: 'Accès aux appels d\'offres', included: true },
                { name: 'Réponses aux chiffrages (Illimité)', included: true },
                { name: 'Support prioritaire 24/7', included: true },
                { name: 'Import catalogue massif', included: true },
                { name: 'Statistiques avancées', included: true },
            ]
        }
    ];

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Abonnements & Tarifs</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Paramètres</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Tarifs</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="card">
                <div className="card-header border-0 pt-5 px-xxl-5 pb-2 text-center">
                    <h3 className="mb-2">Nos offres d'abonnement</h3>
                    <p className="text-muted mb-5">Choisissez le plan adapté à votre entreprise de BTP</p>
                    <div className="d-flex justify-content-center align-items-center gap-3">
                        <span className={!isYearly ? 'fw-bold text-dark' : 'text-muted'}>Mensuel</span>
                        <div className="form-check form-switch p-0 m-0">
                            <input
                                className="form-check-input mx-0"
                                type="checkbox"
                                role="switch"
                                style={{ width: '3rem', height: '1.5rem', cursor: 'pointer' }}
                                checked={isYearly}
                                onChange={() => setIsYearly(!isYearly)}
                            />
                        </div>
                        <span className={isYearly ? 'fw-bold text-dark' : 'text-muted'}>Annuel <span className="badge bg-success-subtle text-success ms-1 small">Économisez 20%</span></span>
                    </div>
                </div>
                <div className="card-body p-xxl-5">
                    <div className="row g-4">
                        {plans.map((plan) => (
                            <div key={plan.name} className="col-lg-4">
                                <div className={`card h-100 border ${plan.popular ? 'border-primary shadow-sm' : ''} position-relative overflow-hidden`}>
                                    {plan.popular && (
                                        <span className="badge bg-primary position-absolute top-0 end-0 mt-3 me-3">Populaire</span>
                                    )}
                                    <div className="card-header border-0 bg-light p-4" style={{ backgroundImage: 'url(/assets/images/background/price.png)', backgroundSize: 'cover' }}>
                                        <h4 className="fw-bold">{plan.name}</h4>
                                        <p className="small text-muted mb-4">{plan.desc}</p>
                                        <div className="display-6 fw-bold text-dark">
                                            €{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                            <span className="h6 text-muted ms-1">/ {isYearly ? 'an' : 'mois'}</span>
                                        </div>
                                    </div>
                                    <div className="card-body p-4">
                                        <ul className="list-unstyled d-grid gap-2 small">
                                            {plan.features.map((feat, i) => (
                                                <li key={i} className={`d-flex align-items-center gap-2 ${!feat.included ? 'opacity-50 text-decoration-line-through' : ''}`}>
                                                    <i className={`fi ${feat.included ? 'fi-rr-check-circle text-success' : 'fi-rr-cross-circle text-danger'}`}></i>
                                                    {feat.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="card-footer p-4 pt-0 border-0 bg-transparent text-center">
                                        {plan.type === 'essai' ? (
                                            <button 
                                                className="btn btn-outline-secondary w-100 py-2 fw-bold"
                                                onClick={() => handleCheckout('essai')}
                                                disabled={loadingPlan === 'essai'}
                                            >
                                                {loadingPlan === 'essai' ? 'Chargement...' : 'Démarrer l\'essai'}
                                            </button>
                                        ) : (
                                            <button 
                                                className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline-primary'} w-100 py-2 fw-bold`}
                                                onClick={() => handleCheckout(isYearly ? 'premium' : 'pack')}
                                                disabled={loadingPlan !== null}
                                            >
                                                {loadingPlan === (isYearly ? 'premium' : 'pack') ? (
                                                    <><span className="spinner-border spinner-border-sm me-2"></span>Redirection Stripe...</>
                                                ) : (
                                                    'Choisir ce plan'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
