import { useState } from 'react'

export default function DevisEnvoyes() {
    const [searchTerm, setSearchTerm] = useState('')

    const quotes = [
        { id: 'QUO-2024-001', project: 'Demande de chiffrage - Projet 2', amount: '12,450.00 €', date: '2026-04-15', status: 'Nouveau', client: 'Noah Yannick', articles: 12 },
        { id: 'QUO-2024-002', project: 'Demande de chiffrage - Projet 2', amount: '8,200.00 €', date: '2026-04-15', status: 'Envoyé', client: 'Noah Yannick', articles: 12 },
        { id: 'QUO-2024-003', project: 'Demande de chiffrage - Projet 2', amount: '115,000.00 €', date: '2026-04-15', status: 'En cours', client: 'Noah Yannick', articles: 12 },
        { id: 'QUO-2024-004', project: 'Demande de chiffrage - Projet 2', amount: '4,500.00 €', date: '2026-04-15', status: 'Terminé', client: 'Noah Yannick', articles: 12 },
        { id: 'QUO-2024-005', project: 'Demande de chiffrage - Projet 2', amount: '9,990.00 €', date: '2026-04-15', status: 'Refusé', client: 'Noah Yannick', articles: 12 },
    ]

    const statusBadgeClass = (s) => {
        if (s === 'Nouveau') return 'bg-primary bg-opacity-10 text-primary'
        if (s === 'Envoyé') return 'bg-info bg-opacity-10 text-info'
        if (s === 'En cours') return 'bg-warning bg-opacity-10 text-warning'
        if (s === 'Terminé') return 'bg-success bg-opacity-10 text-success'
        return 'bg-danger bg-opacity-10 text-danger'
    }

    const filteredQuotes = quotes.filter(q =>
        q.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.client.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="text-start">
            <div className="app-page-head d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="app-page-title">Suivi de Projet</h1>
                    <p className="text-muted small mb-0">Consultez l'historique et le statut de vos offres transmises.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-white border shadow-sm btn-sm px-3">
                        <i className="fi fi-rr-download me-1"></i> Exporter
                    </button>
                </div>
            </div>

            <div className="card border-0 shadow-sm overflow-hidden">
                <div className="card-header bg-white border-bottom p-3">
                    <div className="position-relative" style={{ maxWidth: '350px' }}>
                        <i className="fi fi-rr-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input
                            type="text"
                            className="form-control form-control-sm ps-5 bg-light border-light rounded-pill"
                            placeholder="Rechercher un devis ou projet..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr className="small text-muted text-uppercase">
                                <th className="px-4 py-3">REF</th>
                                <th className="py-3">Projet</th>
                                <th className="py-3">Client</th>
                                <th className="py-3">Articles</th>
                                <th className="py-3">Montant HT</th>
                                <th className="py-3">Date d'échéance</th>
                                <th className="py-3">Statut</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuotes.map((q, idx) => (
                                <tr key={q.id}>
                                    <td className="px-4 py-3 fw-bold text-primary">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="fw-bold text-dark">{q.project}</div>
                                    </td>
                                    <td><span className="text-dark small fw-bold">{q.client}</span></td>
                                    <td><span className="fw-bold text-dark">{q.articles}</span></td>
                                    <td className="fw-bold text-dark">{q.amount}</td>
                                    <td><span className="text-muted small fw-bold">{new Date(q.date).toLocaleDateString('fr-FR')}</span></td>
                                    <td>
                                        <span className={`badge px-2 py-1 rounded-pill ${statusBadgeClass(q.status)}`}>
                                            {q.status}
                                        </span>
                                    </td>
                                    <td className="px-4 text-center">
                                        <div className="d-inline-flex align-items-center gap-2">
                                            <button className="btn btn-sm p-0 border-0 bg-transparent text-warning" title="Voir">
                                                <i className="fi fi-rr-eye"></i>
                                            </button>
                                            {q.status === 'Nouveau' && (
                                                <>
                                                    <button className="btn btn-sm p-0 border-0 bg-transparent text-success" title="Valider">
                                                        <i className="fi fi-rr-check"></i>
                                                    </button>
                                                    <button className="btn btn-sm p-0 border-0 bg-transparent text-danger" title="Refuser">
                                                        <i className="fi fi-rr-cross"></i>
                                                    </button>
                                                </>
                                            )}
                                            {q.status !== 'Nouveau' && (
                                                <button className="btn btn-sm p-0 border-0 bg-transparent text-primary" title="Historique">
                                                    <i className="fi fi-rr-hourglass-end"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
