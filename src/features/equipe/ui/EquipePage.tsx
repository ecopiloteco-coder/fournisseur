import React, { useState } from 'react';

const MEMBERS = [
  { id: 1, name: 'Jean Dupont', email: 'j.dupont@partner.com', role: 'Administrateur', status: 'Actif', avatar: 'JD' },
  { id: 2, name: 'Marc Lefebvre', email: 'm.lefebvre@partner.com', role: 'Chiffreur', status: 'Actif', avatar: 'ML' },
  { id: 3, name: 'Sophie Martin', email: 's.martin@partner.com', role: 'Chiffreur', status: 'En attente', avatar: 'SM' },
];

export function EquipePage() {
  const [members] = useState(MEMBERS);

  return (
    <>
      <div className="app-page-head d-flex justify-content-between align-items-center mb-4">
        <div className="text-start">
          <h1 className="app-page-title">Gestion de l'Équipe</h1>
          <p className="text-muted small mb-0">Gérez les accès de vos collaborateurs à l'espace de chiffrage.</p>
        </div>
        <button className="btn btn-primary shadow-sm btn-sm px-3 rounded-pill">
          <i className="fi fi-rr-user-add me-1"></i> Inviter un membre
        </button>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden text-start">
        <div className="card-header bg-white border-bottom p-3">
          <h6 className="fw-bold mb-0">Membres de l'organisation</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr className="small text-muted text-uppercase">
                <th className="px-4 py-3">Membre</th>
                <th className="py-3">Rôle</th>
                <th className="py-3">Statut</th>
                <th className="px-4 py-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id}>
                  <td className="px-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar avatar-sm bg-primary bg-opacity-10 text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                        {m.avatar}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{m.name}</div>
                        <small className="text-muted">{m.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge border ${m.role === 'Administrateur' ? 'border-primary text-primary' : 'text-muted'}`}>
                      {m.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge rounded-pill bg-${m.status === 'Actif' ? 'success' : 'warning'} bg-opacity-10 text-${m.status === 'Actif' ? 'success' : 'warning'}`}>
                      {m.status}
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
    </>
  );
}
