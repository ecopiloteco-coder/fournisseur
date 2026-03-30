import { useState } from 'react'

export default function SuiviProjet() {
    const [showModal, setShowModal] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)

    const projects = [
        {
            id: 'SP-001',
            name: 'Rénovation Lycée Pasteur',
            progress: 65,
            color: 'primary',
            nextStep: 'Installation tableaux',
            deadline: '2024-04-10',
            timeline: [
                { date: '2024-03-01', title: 'Signature du Marché', desc: 'Contrat validé par Ecopilot', status: 'done' },
                { date: '2024-03-10', title: 'Études techniques', desc: 'Plans et schémas validés', status: 'done' },
                { date: '2024-03-20', title: 'Approvisionnement', desc: 'Réception du matériel principal', status: 'done' },
                { date: '2024-03-25', title: 'Pose des réseaux', desc: 'En cours d\'exécution (Étage 1 & 2)', status: 'current' },
                { date: '2024-04-05', title: 'Vérification Consuel', desc: 'Programmé pour la semaine 14', status: 'pending' },
            ]
        },
        {
            id: 'SP-004',
            name: 'Mairie de Nanterre',
            progress: 15,
            color: 'success',
            nextStep: 'Passage de câbles',
            deadline: '2024-05-15',
            timeline: [
                { date: '2024-03-15', title: 'Ordre de Service', desc: 'Démarrage officiel du lot', status: 'done' },
                { date: '2024-03-22', title: 'Préparation chantier', desc: 'Installation des bases de vie', status: 'current' },
                { date: '2024-04-01', title: 'Passage réseaux', desc: 'Début des percements', status: 'pending' },
            ]
        },
    ]

    const handleOpenDetails = (project) => {
        setSelectedProject(project)
        setShowModal(true)
    }

    return (
        <div className="text-start">
            <div className="app-page-head mb-4">
                <h1 className="app-page-title">Suivi de Projet</h1>
                <p className="text-muted small mb-0">Suivez l'avancement de vos chantiers en temps réel.</p>
            </div>

            <div className="row g-4">
                {projects.map(p => (
                    <div key={p.id} className="col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="badge bg-light text-primary border border-primary border-opacity-10">{p.id}</div>
                                    <span className="small text-muted fw-bold">Échéance: {p.deadline}</span>
                                </div>
                                <h5 className="fw-bold text-dark mb-4">{p.name}</h5>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="small fw-bold">Avancement Global</span>
                                        <span className="small fw-bold">{p.progress}%</span>
                                    </div>
                                    <div className="progress" style={{ height: '10px' }}>
                                        <div className={`progress-bar bg-${p.color}`} style={{ width: `${p.progress}%` }}></div>
                                    </div>
                                </div>

                                <div className="card bg-light border-0 p-3 mb-4 text-start">
                                    <div className="d-flex gap-3 align-items-center">
                                        <div className={`avatar avatar-sm bg-${p.color} text-white rounded-circle d-flex align-items-center justify-content-center`}>
                                            <i className="fi fi-rr-settings-sliders"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Prochaine étape</small>
                                            <span className="fw-bold text-dark small">{p.nextStep}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        onClick={() => handleOpenDetails(p)}
                                        className="btn btn-primary btn-sm rounded-pill px-4 flex-grow-1"
                                    >
                                        Détails Chantier
                                    </button>
                                    <button className="btn btn-outline-secondary btn-sm rounded-pill px-3">Rapports</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Timeline Modal (Manual implementation using Bootstrap classes) */}
            {showModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg">
                                <div className="modal-header border-0 pb-0 px-4 pt-4">
                                    <div>
                                        <h5 className="modal-title fw-bold mb-0">Timeline du Projet</h5>
                                        <small className="text-muted">{selectedProject?.name}</small>
                                    </div>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                                </div>
                                <div className="modal-body p-4 px-5">
                                    <div className="timeline-btp position-relative py-3">
                                        <div className="timeline-line position-absolute h-100 border-start border-2 border-primary border-opacity-25" style={{ left: '15px' }}></div>

                                        {selectedProject?.timeline.map((item, index) => (
                                            <div key={index} className="timeline-item position-relative ps-5 pb-4 text-start">
                                                <div className={`timeline-dot position-absolute rounded-circle bg-white border border-2 border-${item.status === 'done' ? 'success' : (item.status === 'current' ? 'primary' : 'secondary')} d-flex align-items-center justify-content-center`}
                                                    style={{ left: '-3px', width: '22px', height: '22px', top: '0', zIndex: 2 }}>
                                                    {item.status === 'done' && <i className="fi fi-rr-check text-success x-small" style={{ fontSize: '10px' }}></i>}
                                                    {item.status === 'current' && <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>}
                                                </div>
                                                <div>
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <h6 className={`fw-bold mb-0 ${item.status === 'current' ? 'text-primary' : 'text-dark'}`}>{item.title}</h6>
                                                        <span className="badge bg-light text-muted fw-normal x-small">{item.date}</span>
                                                    </div>
                                                    <p className="text-muted small mb-0">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 p-3 bg-light rounded-3 d-flex align-items-center gap-3 text-start">
                                        <i className="fi fi-rr-info text-primary fs-5"></i>
                                        <p className="small mb-0 text-muted">Les jalons sont mis à jour quotidiennement par le conducteur de travaux.</p>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 pt-0">
                                    <button className="btn btn-white border px-4 rounded-pill" onClick={() => setShowModal(false)}>Fermer</button>
                                    <button className="btn btn-primary px-4 rounded-pill fw-bold">Signaler un retard</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
