import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/providers/AuthContext';
import { Building2, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { getApiUrl } from '../../../shared/config';
import { getBackendURL } from '../../../shared/lib/api-bridge';

export function Auth() {
  const { user, isLoading, signIn, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const paymentHandledRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const confirmPaymentIfNeeded = async () => {
      if (paymentHandledRef.current) return;

      const params = new URLSearchParams(location.search);
      const payment = params.get('payment');
      const sessionId = params.get('session_id');

      if (payment === 'cancel') {
        paymentHandledRef.current = true;
        setActiveTab('register');
        setInfo(null);
        setError("Paiement annulé. Veuillez réessayer.");
        navigate('/auth', { replace: true });
        return;
      }

      if (payment !== 'success' || !sessionId) return;

      paymentHandledRef.current = true;
      setIsGlobalLoading(true);
      setError(null);
      setInfo("Confirmation du paiement en cours...");

      try {
        const response = await fetch(
          `${getBackendURL()}/api/fournisseurs/abonnements/confirm-session?sessionId=${encodeURIComponent(sessionId)}`,
          { method: 'POST' }
        );

        if (!response.ok) {
          throw new Error("Impossible de confirmer le paiement");
        }

        setActiveTab('login');
        setError(null);
        setInfo("Paiement confirmé. Votre entreprise est activée, vous pouvez vous connecter.");
      } catch (err: any) {
        setInfo(null);
        setError(err?.message || "Erreur lors de la confirmation du paiement");
      } finally {
        setIsGlobalLoading(false);
        navigate('/auth', { replace: true });
      }
    };

    void confirmPaymentIfNeeded();
  }, [location.search, navigate]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Lots disponibles (mockés — remplacés par API quand disponible)
  const LOTS_DISPONIBLES = [
    { id: '00000000-0000-0000-0000-000000000001', label: 'Lot 1 — Gros Œuvre' },
    { id: '00000000-0000-0000-0000-000000000002', label: 'Lot 2 — Charpente' },
    { id: '00000000-0000-0000-0000-000000000003', label: 'Lot 3 — Couverture' },
    { id: '00000000-0000-0000-0000-000000000004', label: 'Lot 4 — Menuiserie extérieure' },
    { id: '00000000-0000-0000-0000-000000000005', label: 'Lot 5 — Plomberie' },
    { id: '00000000-0000-0000-0000-000000000006', label: 'Lot 6 — Électricité' },
    { id: '00000000-0000-0000-0000-000000000007', label: 'Lot 7 — Peinture' },
    { id: '00000000-0000-0000-0000-000000000008', label: 'Lot 8 — Carrelage' },
  ];

  // Inscription state
  const [nomEntreprise, setNomEntreprise] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [categorie, setCategorie] = useState('BTP');
  const [pack, setPack] = useState('pack');
  const [selectedLots, setSelectedLots] = useState<string[]>([]);

  const toggleLot = (id: string) => {
    setSelectedLots(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsGlobalLoading(true);

    try {
      const { error: signInError } = await signIn(loginEmail, loginPassword);
      if (signInError) {
        setError(signInError.message || 'Email ou mot de passe incorrect');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsGlobalLoading(true);

    try {
      const { error: signUpError } = await signUp({
        email,
        nomEntreprise,
        telephone,
        adresse,
        categorie,
        pack,
        lots: selectedLots,
      });

      if (signUpError) {
        setError(signUpError.message || "Erreur lors de l'inscription");
      }
      // Redirection to Stripe is handled in AuthContext
    } catch (err: any) {
        setError(err.message || "Erreur lors de l'inscription");
    } finally {
        setIsGlobalLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4 bg-background">
      <div className="card shadow-lg border-0 w-100 bg-card text-foreground" style={{ maxWidth: '450px', borderRadius: '1rem' }}>
        <div className="card-header bg-card text-center border-0 pt-5 pb-3">
          <div className="d-flex justify-content-center mb-3">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
              <Building2 size={30} />
            </div>
          </div>
          <h4 className="fw-bold mb-1">EcoPilot Fournisseur</h4>
          <p className="text-muted small">Portail Partenaires BTP</p>
        </div>

        <div className="card-body p-4 pt-0">
          <ul className="nav nav-pills nav-justified mb-4" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => { setActiveTab('login'); setError(null); }}
                type="button"
              >
                Connexion
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => { setActiveTab('register'); setError(null); }}
                type="button"
              >
                Inscription
              </button>
            </li>
          </ul>

          {error && (
            <div className="alert alert-danger d-flex align-items-center p-3 mb-4" role="alert">
              <AlertCircle size={18} className="me-2 flex-shrink-0" />
              <div className="small">{error}</div>
            </div>
          )}

          {info && (
            <div className="alert alert-success d-flex align-items-center p-3 mb-4" role="alert">
              <div className="small">{info}</div>
            </div>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Email professionnel</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg bg-light" 
                  placeholder="contact@entreprise.com" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  disabled={isGlobalLoading} 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Mot de passe</label>
                <div className="input-group">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-control form-control-lg bg-light border-end-0" 
                    placeholder="••••••••" 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)} 
                    disabled={isGlobalLoading} 
                    required 
                  />
                  <button 
                    className="btn btn-light bg-light border border-start-0 text-muted" 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold" disabled={isGlobalLoading}>
                {isGlobalLoading ? <><Loader2 size={18} className="me-2 spinner-border spinner-border-sm" />Connexion...</> : 'Se connecter'}
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Nom de l'entreprise *</label>
                <input 
                  type="text" 
                  className="form-control bg-light" 
                  placeholder="BatiPro SARL" 
                  value={nomEntreprise} 
                  onChange={(e) => setNomEntreprise(e.target.value)} 
                  disabled={isGlobalLoading} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Adresse de l'entreprise *</label>
                <input 
                  type="text" 
                  className="form-control bg-light" 
                  placeholder="123 rue du BTP, Paris" 
                  value={adresse} 
                  onChange={(e) => setAdresse(e.target.value)} 
                  disabled={isGlobalLoading} 
                  required 
                />
              </div>
              <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-bold text-muted">Catégorie *</label>
                    <select 
                      className="form-select bg-light"
                      value={categorie}
                      onChange={(e) => setCategorie(e.target.value)}
                      disabled={isGlobalLoading}
                    >
                      <option value="BTP">BTP / Travaux</option>
                      <option value="MATERIAUX">Matériaux</option>
                      <option value="LOCATION">Location d'engins</option>
                      <option value="SERVICES">Services</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-bold text-muted">Téléphone</label>
                    <input 
                      type="tel" 
                      className="form-control bg-light" 
                      placeholder="+33 6 12 34 56 78" 
                      value={telephone} 
                      onChange={(e) => setTelephone(e.target.value)} 
                      disabled={isGlobalLoading} 
                    />
                  </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Email professionnel *</label>
                <input 
                  type="email" 
                  className="form-control bg-light" 
                  placeholder="contact@entreprise.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={isGlobalLoading} 
                  required 
                />
              </div>
              {/* ─── Lots BTP ─────────────────────────────────────────────── */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Lots de travaux <span className="text-muted fw-normal">(optionnel)</span></label>
                <div className="border rounded bg-light p-2" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                  {LOTS_DISPONIBLES.map(lot => (
                    <div key={lot.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`lot-${lot.id}`}
                        value={lot.id}
                        checked={selectedLots.includes(lot.id)}
                        onChange={() => toggleLot(lot.id)}
                        disabled={isGlobalLoading}
                      />
                      <label className="form-check-label small" htmlFor={`lot-${lot.id}`}>
                        {lot.label}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedLots.length > 0 && (
                  <div className="mt-1">
                    <small className="text-primary">{selectedLots.length} lot(s) sélectionné(s)</small>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Pack d'abonnement *</label>
                <div className="d-flex gap-2">
                   <button type="button" onClick={() => setPack('essai')} className={`btn btn-sm flex-grow-1 ${pack === 'essai' ? 'btn-primary' : 'btn-outline-secondary'}`}>Essai (15j)</button>
                   <button type="button" onClick={() => setPack('pack')} className={`btn btn-sm flex-grow-1 ${pack === 'pack' ? 'btn-primary' : 'btn-outline-secondary'}`}>Pack Pro</button>
                   <button type="button" onClick={() => setPack('premium')} className={`btn btn-sm flex-grow-1 ${pack === 'premium' ? 'btn-primary' : 'btn-outline-secondary'}`}>Premium</button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold" disabled={isGlobalLoading}>
                {isGlobalLoading ? <><Loader2 size={18} className="me-2 spinner-border spinner-border-sm" />Redirection...</> : "S'inscrire et payer"}
              </button>
              <div className="text-center mt-2">
                <small className="text-muted">Vous recevrez vos identifiants par email après le paiement.</small>
              </div>
            </form>
          )}
        </div>
        <div className="card-footer bg-light text-center py-3 border-top-0" style={{ borderBottomLeftRadius: '1rem', borderBottomRightRadius: '1rem' }}>
          <p className="text-muted small mb-0">
             En continuant, vous acceptez nos <a href="#" className="text-decoration-none">CGU</a> et notre <a href="#" className="text-decoration-none">Politique de confidentialité</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
