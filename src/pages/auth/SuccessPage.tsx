import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <div className="card shadow-lg border-0 w-100 text-center p-5" style={{ maxWidth: '500px', borderRadius: '1.5rem' }}>
        <div className="d-flex justify-content-center mb-4">
          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
            <CheckCircle size={48} />
          </div>
        </div>
        
        <h2 className="fw-bold text-dark mb-3">Paiement Réussi !</h2>
        <p className="text-muted mb-4 fs-5">
          Votre inscription est maintenant complète. Nous préparons votre accès à la plateforme EcoPilot.
        </p>
        
        <div className="alert alert-info border-0 mb-4 text-start">
          <ul className="mb-0 small">
            <li>Un email de confirmation vient de vous être envoyé.</li>
            <li>Vos identifiants de connexion (email et mot de passe temporaire) s'y trouvent.</li>
            <li>Vérifiez vos spams si vous ne le voyez pas d'ici 5 minutes.</li>
          </ul>
        </div>

        <button 
          onClick={() => navigate('/auth')} 
          className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
        >
          Aller vers la connexion <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
