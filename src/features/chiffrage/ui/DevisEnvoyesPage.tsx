import React, { useState } from 'react';

const QUOTES = [
  { id: 'QUO-2024-001', project: 'Rénovation Lycée Pasteur', amount: '12,450.00 €', date: '2024-03-05', status: 'Accepté', client: 'BTP Construction SA' },
  { id: 'QUO-2024-002', project: 'EHPAD Les Glycines', amount: '8,200.00 €', date: '2024-03-01', status: 'En attente', client: 'Vinci Construction' },
  { id: 'QUO-2024-003', project: 'Immeuble Le Quartz', amount: '115,000.00 €', date: '2024-02-28', status: 'Refusé', client: 'Bouygues Immobilier' },
  { id: 'QUO-2024-004', project: 'Mairie de Nanterre', amount: '4,500.00 €', date: '2024-02-25', status: 'Accepté', client: 'Ville de Nanterre' },
];

const statusColor = (s: string) => s === 'Accepté' ? 'success' : s === 'Refusé' ? 'danger' : 'warning';

export function DevisEnvoyesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = QUOTES.filter(q =>
    q.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-start">
      <div className="app-page-head d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="app-page-title">Mes Devis Envoyés</h1>
          <p className="text-muted small mb-0">Consultez l'historique et le statut de vos offres transmises.</p>
        </div>
        <button className="btn btn-white border shadow-sm btn-sm px-3">
          <i className="fi fi-rr-download me-1"></i> Exporter
        </button>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="card-header bg-white border-bottom p-3">
          <div className="position-relative" style={{ maxWidth: '350px' }}>
            <i className="fi fi-rr-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input type="text" className="form-control form-control-sm ps-5 bg-light border-light rounded-pill"
              placeholder="Rechercher un devis ou projet..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr className="small text-muted text-uppercase">
                <th className="px-4 py-3">Référence / Projet</th>
                <th className="py-3">Client</th>
                <th className="py-3">Montant HT</th>
                <th className="py-3">Date d'envoi</th>
                <th className="py-3">Statut</th>
                <th className="px-4 py-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id}>
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark">{q.project}</div>
                    <div className="small text-muted">{q.id}</div>
                  </td>
                  <td><span className="text-dark small fw-bold">{q.client}</span></td>
                  <td className="fw-bold text-dark">{q.amount}</td>
                  <td><span className="text-muted small">{q.date}</span></td>
                  <td>
                    <span className={`badge bg-${statusColor(q.status)} bg-opacity-10 text-${statusColor(q.status)} px-2 py-1 rounded-pill`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 text-end">
                    <button className="btn btn-sm btn-outline-primary rounded-circle p-1">
                      <i className="fi fi-rr-download px-2 py-1 d-block"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
