import React, { useState } from 'react';
import { inviteEquipeMember, getEquipeMembers } from '../equipeService';
import { toast } from 'sonner';

export function EquipePage() {
  const [members, setMembers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nom_utilisateur: '',
    telephone: '',
    email: '',
    role: 'CHIFFREUR'
  });

  const fetchMembers = async () => {
    try {
      setFetching(true);
      const data = await getEquipeMembers();
      setMembers(data || []);
    } catch (error: any) {
      toast.error("Impossible de charger les membres de l'équipe.");
    } finally {
      setFetching(false);
    }
  };

  React.useEffect(() => {
    fetchMembers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!formData.nom_utilisateur || !formData.email) {
      setErrorMsg('Veuillez remplir les champs obligatoires.');
      return;
    }

    setLoading(true);
    try {
      const response = await inviteEquipeMember(formData);
      if (response.success) {
        toast.success("Membre invité avec succès. Un e-mail a été envoyé.");
        setShowModal(false);
        setFormData({ nom_utilisateur: '', telephone: '', email: '', role: 'CHIFFREUR' });
        fetchMembers(); // Re-fetch list
      } else {
        setErrorMsg(response.message || "Erreur lors de l'invitation");
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Une erreur technique s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  const getAvatar = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <div className="app-page-head d-flex justify-content-between align-items-center mb-4">
        <div className="text-start">
          <h1 className="app-page-title">Gestion de l'Équipe</h1>
          <p className="text-muted small mb-0">Gérez les accès de vos collaborateurs à l'espace de chiffrage.</p>
        </div>
        <button 
          className="btn btn-primary shadow-sm btn-sm px-3 rounded-pill"
          onClick={() => { setShowModal(true); setErrorMsg(null); }}
        >
          <i className="fi fi-rr-user-add me-1"></i> Inviter un membre
        </button>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden text-start">
        <div className="card-header bg-white border-bottom p-3">
          <h6 className="fw-bold mb-0">Membres de l'organisation</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ backgroundColor: '#0978E8' }}>
              <tr className="small text-uppercase border-0" style={{ letterSpacing: '0.5px' }}>
                <th className="px-4 py-3 text-white fw-bold bg-transparent" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Membre</th>
                <th className="py-3 text-white fw-bold bg-transparent">Rôle</th>
                <th className="py-3 text-white fw-bold bg-transparent">Statut</th>
                <th className="px-4 py-3 text-end text-white fw-bold bg-transparent" style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Chargement des membres...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">Aucun membre trouvé.</td>
                </tr>
              ) : members.map(m => (
                <tr key={m.id}>
                  <td className="px-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar avatar-sm bg-primary bg-opacity-10 text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                        {getAvatar(m.nom_utilisateur)}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{m.nom_utilisateur}</div>
                        <small className="text-muted">{m.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge border ${m.role === 'Administrateur' || m.role === 'Administrateur Fournisseur' || m.role === 'ADMIN_FOURNISSEUR' ? 'border-primary text-primary' : 'text-muted'}`}>
                      {m.role === 'ADMIN_FOURNISSEUR' ? 'Administrateur' : m.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge rounded-pill bg-${m.isActive ? 'success' : 'warning'} bg-opacity-10 text-${m.isActive ? 'success' : 'warning'}`}>
                      {m.isActive ? 'Actif' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-4 text-end">
                    <button className="btn btn-link link-secondary text-decoration-none p-0">
                      <i className="fi fi-rr-menu-dots-vertical"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow text-start">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Ajouter un membre</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {errorMsg && (
                  <div className="alert alert-danger d-flex align-items-center py-2 px-3 small border-0 mb-3" style={{ borderRadius: '8px' }}>
                    <i className="fi fi-rr-exclamation me-2"></i>
                    {errorMsg}
                  </div>
                )}
                <form onSubmit={handleInvite}>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Nom et Prénom <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="nom_utilisateur"
                      value={formData.nom_utilisateur}
                      onChange={handleInputChange}
                      placeholder="Saisissez le nom complet"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Téléphone</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="Saisissez le numéro de téléphone"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">E-mail <span className="text-danger">*</span></label>
                    <input 
                      type="email" 
                      className="form-control" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Saisissez l'adresse e-mail"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold">Rôle</label>
                    <select 
                      className="form-select" 
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="CHIFFREUR">Chiffreur</option>
                      <option value="ADMIN_FOURNISSEUR">Administrateur Fournisseur</option>
                    </select>
                  </div>
                  
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)} disabled={loading}>
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Invitation...' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
