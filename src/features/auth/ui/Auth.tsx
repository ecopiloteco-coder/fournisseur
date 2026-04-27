import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/providers/AuthContext';
import { Building2, AlertCircle, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { getBackendURL } from '../../../shared/lib/api-bridge';

const LOTS_DISPONIBLES = [
  { id: '00000000-0000-0000-0000-000000000001', label: 'sols souples' },
  { id: '00000000-0000-0000-0000-000000000002', label: 'sols durs' },
  { id: '00000000-0000-0000-0000-000000000003', label: 'couverture' },
  { id: '00000000-0000-0000-0000-000000000004', label: 'curage' },
  { id: '00000000-0000-0000-0000-000000000005', label: 'cloisons et doublages' },
  { id: '00000000-0000-0000-0000-000000000006', label: 'electricite' },
  { id: '00000000-0000-0000-0000-000000000007', label: 'gros oeuvres' },
  { id: '00000000-0000-0000-0000-000000000008', label: 'peinture' },
  { id: '00000000-0000-0000-0000-000000000009', label: 'etancheite' },
  { id: '00000000-0000-0000-0000-000000000010', label: 'facades' },
  { id: '00000000-0000-0000-0000-000000000011', label: 'cvc plomberie' },
  { id: '00000000-0000-0000-0000-000000000012', label: 'menuiseries interieures' },
  { id: '00000000-0000-0000-0000-000000000013', label: 'demolition' },
  { id: '00000000-0000-0000-0000-000000000014', label: 'serrurerie metallerie' },
];

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

  // Inscription state
  const [registerStep, setRegisterStep] = useState(1);
  const [nomEntreprise, setNomEntreprise] = useState('');
  const [siteWeb, setSiteWeb] = useState('');
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
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

  const handleNextStep = () => {
    setError(null);
    if (registerStep === 1) {
      if (!nomEntreprise || !adresse) {
        setError('Veuillez remplir tous les champs obligatoires (Nom et Adresse).');
        return;
      }
      if (selectedLots.length === 0) {
        setError('Veuillez selectionner au moins un lot.');
        return;
      }
      setRegisterStep(2);
    } else if (registerStep === 2) {
      if (!email) {
        setError('Veuillez fournir un email professionnel valide.');
        return;
      }
      setRegisterStep(3);
    }
  };

  const handlePrevStep = () => {
    setError(null);
    setRegisterStep(prev => prev - 1);
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

    if (selectedLots.length === 0) {
      setError('Veuillez selectionner au moins un lot.');
      return;
    }
    if (registerStep !== 3) {
        return;
    }

    setIsGlobalLoading(true);

    try {
      const { error: signUpError } = await signUp({
        email,
        nomEntreprise,
        siteWeb,
        nom,
        prenom,
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
              {/* Stepper Timeline */}
              <div className="d-flex justify-content-between align-items-center mb-4 px-2 position-relative">
                <div className="position-absolute top-50 start-0 end-0 translate-middle-y" style={{ height: '2px', backgroundColor: '#e9ecef', zIndex: 0 }}>
                  <div style={{ height: '100%', backgroundColor: '#0d6efd', width: registerStep === 1 ? '0%' : registerStep === 2 ? '50%' : '100%', transition: 'width 0.3s ease' }}></div>
                </div>
                
                {[1, 2, 3].map((step) => (
                  <div key={step} className="position-relative d-flex flex-column align-items-center" style={{ zIndex: 1 }}>
                    <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${registerStep >= step ? 'bg-primary text-white' : 'bg-light text-muted border'}`} style={{ width: '32px', height: '32px', transition: 'all 0.3s ease' }}>
                      {registerStep > step ? <CheckCircle2 size={16} /> : step}
                    </div>
                    <small className={`position-absolute top-100 mt-1 text-nowrap fw-bold ${registerStep >= step ? 'text-primary' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                      {step === 1 ? 'Entreprise' : step === 2 ? 'Profil' : 'Plan'}
                    </small>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-2"></div>

              {registerStep === 1 && (
                <div className="animation-fade-in">
                  <h5 className="mb-3 fw-bold text-dark">Informations de l'entreprise</h5>
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
                <label className="form-label small fw-bold text-muted">Site Web</label>
                <input 
                  type="url" 
                  className="form-control bg-light" 
                  placeholder="https://www.entreprise.com" 
                  value={siteWeb} 
                  onChange={(e) => setSiteWeb(e.target.value)} 
                  disabled={isGlobalLoading} 
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
              </div>
              {/* ─── Lots BTP ─────────────────────────────────────────────── */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Lots de travaux *</label>
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
                {selectedLots.length === 0 && (
                  <div className="mt-1">
                    <small className="text-danger">Selection obligatoire: au moins un lot.</small>
                  </div>
                )}
              </div>

              <button type="button" className="btn btn-primary btn-lg w-100 fw-bold mt-2" onClick={handleNextStep}>
                Suivant
              </button>
            </div>
            )}

            {registerStep === 2 && (
              <div className="animation-fade-in">
                <h5 className="mb-3 fw-bold text-dark">Mon Profil (Administrateur)</h5>
                
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Rôle *</label>
                  <input 
                    type="text" 
                    className="form-control bg-light" 
                    value="Administrateur Fournisseur" 
                    disabled 
                  />
                  <small className="text-muted">Par défaut, le créateur du compte est l'administrateur principal.</small>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-muted">Nom *</label>
                      <input 
                        type="text" 
                        className="form-control bg-light" 
                        placeholder="Dupont" 
                        value={nom} 
                        onChange={(e) => setNom(e.target.value)} 
                        disabled={isGlobalLoading} 
                        required 
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-muted">Prénom *</label>
                      <input 
                        type="text" 
                        className="form-control bg-light" 
                        placeholder="Jean" 
                        value={prenom} 
                        onChange={(e) => setPrenom(e.target.value)} 
                        disabled={isGlobalLoading} 
                        required 
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
                
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Téléphone (Optionnel)</label>
                  <input 
                    type="tel" 
                    className="form-control bg-light" 
                    placeholder="+33 6 12 34 56 78" 
                    value={telephone} 
                    onChange={(e) => setTelephone(e.target.value)} 
                    disabled={isGlobalLoading} 
                  />
                </div>

                <div className="d-flex gap-2 mt-2">
                  <button type="button" className="btn btn-outline-secondary btn-lg flex-grow-1 fw-bold" onClick={handlePrevStep}>
                    Précédent
                  </button>
                  <button type="button" className="btn btn-primary btn-lg flex-grow-1 fw-bold" onClick={handleNextStep}>
                    Suivant
                  </button>
                </div>
              </div>
            )}

            {registerStep === 3 && (
              <div className="animation-fade-in">
                <h5 className="mb-3 fw-bold text-dark">Choix de l'abonnement</h5>
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Pack d'abonnement *</label>
                <div className="d-flex gap-2">
                   <button type="button" onClick={() => setPack('essai')} className={`btn btn-sm flex-grow-1 ${pack === 'essai' ? 'btn-primary' : 'btn-outline-secondary'}`}>Essai (15j)</button>
                   <button type="button" onClick={() => setPack('pack')} className={`btn btn-sm flex-grow-1 ${pack === 'pack' ? 'btn-primary' : 'btn-outline-secondary'}`}>Pack Pro</button>
                   <button type="button" onClick={() => setPack('premium')} className={`btn btn-sm flex-grow-1 ${pack === 'premium' ? 'btn-primary' : 'btn-outline-secondary'}`}>Premium</button>
                </div>
              </div>

              <div className="d-flex gap-2 mt-2 mb-2">
                <button type="button" className="btn btn-outline-secondary btn-lg flex-grow-1 fw-bold" onClick={handlePrevStep} disabled={isGlobalLoading}>
                  Précédent
                </button>
                <button type="submit" className="btn btn-primary btn-lg flex-grow-1 fw-bold" disabled={isGlobalLoading}>
                  {isGlobalLoading ? <><Loader2 size={18} className="me-2 spinner-border spinner-border-sm" />Redirection...</> : "S'inscrire et payer"}
                </button>
              </div>
              
              <div className="text-center mt-2">
                <small className="text-muted">Vous recevrez vos identifiants par email après le paiement.</small>
              </div>
            </div>
            )}
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
