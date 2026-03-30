import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../../shared/providers/NotificationProvider'

const DemandCard = ({ project, onSignal }) => {
    return (
        <div
            className="card shadow-sm border-0 mb-3 hover-shadow-lg transition-all cursor-pointer card-action"
            style={{ borderRadius: '12px' }}
            data-id={project.id}
        >
            <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold text-dark mb-0 small text-start" style={{ lineHeight: '1.4', fontSize: '13px' }}>{project.name}</h6>
                    <span className="badge bg-light text-primary border px-2 py-1 flex-shrink-0 ms-2" style={{ fontSize: '9px' }}>{project.id}</span>
                </div>
                <p className="text-muted mb-3 text-start d-flex align-items-center" style={{ fontSize: '11px' }}>
                    <i className="fi fi-rr-layers me-1 text-primary"></i> {project.lot}
                </p>

                <div className="row g-0 mb-3 text-start bg-light rounded-3 p-2">
                    <div className="col-6 border-end pe-2">
                        <small className="text-muted d-block" style={{ fontSize: '10px' }}>Articles</small>
                        <span className="fw-bold text-dark" style={{ fontSize: '12px' }}><i className="fi fi-rr-box-alt me-1 text-primary"></i> {project.articles}</span>
                    </div>
                    <div className="col-6 ps-2">
                        <small className="text-muted d-block" style={{ fontSize: '10px' }}>Budget Est.</small>
                        <span className="fw-bold text-dark" style={{ fontSize: '12px' }}>{project.budget}</span>
                    </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                    <div className={`p-2 rounded-3 bg-white border d-flex align-items-center gap-2 w-100 ${project.isLate ? 'border-danger' : 'border-light-subtle shadow-sm'}`}>
                        <i className={`fi fi-rr-calendar-clock ${project.isLate ? 'text-danger' : 'text-warning'}`} style={{ fontSize: '14px' }}></i>
                        <span className={`fw-bold ${project.isLate ? 'text-danger' : 'text-dark'}`} style={{ fontSize: '11px' }}>{project.date}</span>
                        {project.isLate && <span className="ms-auto badge bg-danger text-white px-1" style={{ fontSize: '8px' }}>RETARD</span>}
                    </div>
                </div>

                <div className="d-flex gap-2 mt-auto">
                    <button
                        className="btn btn-sm btn-outline-warning flex-grow-1 fw-bold p-2 d-flex align-items-center justify-content-center"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSignal(project); }}
                        style={{ fontSize: '10px', borderRadius: '8px' }}
                    >
                        Signaler
                    </button>
                    <Link
                        to={`/projets/chiffrage/${project.id}`}
                        className="btn btn-sm btn-primary flex-grow-1 fw-bold p-2 shadow-sm d-flex align-items-center justify-content-center"
                        style={{ fontSize: '10px', borderRadius: '8px' }}
                    >
                        Chiffrer
                    </Link>
                </div>
            </div>
        </div>
    )
}

const DemandColumn = ({ title, status, projects, onSignal, statusClass }) => (
    <div className="col-lg-3" style={{ minWidth: '280px' }}>
        <div className={`card bg-light bg-opacity-50 border-0 shadow-none h-auto rounded-4 border-top border-4 border-${statusClass}`}>
            <div className="card-header bg-transparent border-0 p-3 pb-0 d-flex justify-content-between align-items-center text-start">
                <h6 className="fw-extrabold mb-0 text-dark" style={{ fontSize: '14px' }}>{title} <span className="badge bg-white text-muted ms-1 small px-2 py-1 border">{projects.length}</span></h6>
                <button className="btn btn-icon btn-sm"><i className="fi fi-rr-menu-dots-vertical"></i></button>
            </div>
            <div className="card-body p-2 task-list" data-status={status} style={{ minHeight: '150px' }}>
                {projects.map(p => (
                    <DemandCard key={p.id} project={p} onSignal={onSignal} />
                ))}
                {projects.length === 0 && (
                    <div className="text-center py-4 text-muted border border-dashed rounded-3 bg-white bg-opacity-50">
                        <i className="fi fi-rr-inbox d-block mb-1" style={{ fontSize: '20px' }}></i>
                        <small style={{ fontSize: '10px' }}>Vide</small>
                    </div>
                )}
            </div>
        </div>
    </div>
)

export default function DemandesChiffrage() {
    const { sendSignal } = useNotifications()
    const [viewMode, setViewMode] = useState('kanban') // 'kanban' or 'list'
    const [searchTerm, setSearchTerm] = useState('')
    const [showSignalModal, setShowSignalModal] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [signalMessage, setSignalMessage] = useState('')
    const [signalType, setSignalType] = useState('retard_livraison')

    const [projects, setProjects] = useState([
        { id: 'PRJ-2024-001', name: 'Rénovation Lycée Pasteur', lot: 'Lot 03 - Électricité', date: '2024-03-15', status: 'Nouveau', budget: '15,000 €', articles: 45, isLate: false },
        { id: 'PRJ-2024-002', name: 'EHPAD Les Glycines', lot: 'Lot 12 - Peinture', date: '2024-03-20', status: 'En cours', budget: '8,500 €', articles: 12, isLate: false },
        { id: 'PRJ-2024-003', name: 'Immeuble Le Quartz', lot: 'Lot 01 - Gros Oeuvre', date: '2024-03-10', status: 'Nouveau', budget: '120,000 €', articles: 156, isLate: true },
        { id: 'PRJ-2024-004', name: 'Clinique du Parc', lot: 'Lot 05 - Plomberie', date: '2024-03-25', status: 'Soumis', budget: '42,000 €', articles: 88, isLate: false },
        { id: 'PRJ-2024-005', name: 'Parking Gare Nord', lot: 'Lot 08 - Éclairage', date: '2024-03-05', status: 'Terminé', budget: '12,000 €', articles: 24, isLate: false },
    ])

    const columns = [
        { title: 'Nouveaux', status: 'Nouveau', statusClass: 'primary' },
        { title: 'En cours', status: 'En cours', statusClass: 'warning' },
        { title: 'Soumis', status: 'Soumis', statusClass: 'info' },
        { title: 'Terminé', status: 'Terminé', statusClass: 'success' }
    ]

    useEffect(() => {
        let sortableInstances = [];
        if (window.Sortable && viewMode === 'kanban') {
            const taskLists = document.querySelectorAll('.task-list');
            taskLists.forEach(el => {
                const s = new window.Sortable(el, {
                    group: 'demands',
                    animation: 150,
                    ghostClass: 'bg-light-subtle',
                    dragClass: 'sortable-drag',
                    onEnd: (evt) => {
                        const { from, to, item, oldIndex } = evt;
                        const newStatus = to.getAttribute('data-status');
                        const projectId = item.getAttribute('data-id');

                        // Revert DOM change so React can handle the re-render
                        if (from !== to) {
                            from.insertBefore(item, from.children[oldIndex]);
                        } else {
                            const children = Array.from(from.children);
                            if (children[oldIndex]) {
                                from.insertBefore(item, children[oldIndex]);
                            }
                        }

                        if (projectId && newStatus) {
                            setProjects(current => current.map(p =>
                                p.id === projectId ? { ...p, status: newStatus } : p
                            ));
                        }
                    }
                });
                sortableInstances.push(s);
            });
        }
        return () => {
            sortableInstances.forEach(s => s.destroy());
        };
    }, [viewMode, projects.length]);

    const handleOpenSignal = (p) => {
        setSelectedProject(p)
        setShowSignalModal(true)
    }

    const handleSendSignal = () => {
        sendSignal('internal', 'supplier_signal', signalMessage, {
            projectId: selectedProject.id,
            projectName: selectedProject.name,
            motif: signalType
        })
        setShowSignalModal(false)
        setSignalMessage('')
    }

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lot.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <>
            <div className="app-page-head d-flex justify-content-between align-items-center mb-4 text-start">
                <div>
                    <h1 className="app-page-title">Demandes de Chiffrage</h1>
                    <p className="text-muted small mb-0">Répondez aux appels d'offres et soumettez vos prix.</p>
                </div>
                <div className="d-flex gap-2">
                    <div className="btn-group btn-group-sm bg-white p-1 rounded-pill shadow-sm border">
                        <button onClick={() => setViewMode('kanban')} className={`btn rounded-pill px-3 py-1 border-0 ${viewMode === 'kanban' ? 'btn-primary' : 'btn-light'}`}>
                            <i className="fi fi-rr-apps me-1"></i> Kanban
                        </button>
                        <button onClick={() => setViewMode('list')} className={`btn rounded-pill px-3 py-1 border-0 ${viewMode === 'list' ? 'btn-primary' : 'btn-light'}`}>
                            <i className="fi fi-rr-list me-1"></i> Liste
                        </button>
                    </div>
                </div>
            </div>

            <div className="card d-flex flex-row align-items-center h-auto mb-4 border-0 shadow-sm overflow-hidden text-start">
                <div className="p-3 bg-light border-end">
                    <div className="input-group input-group-sm bg-white rounded border px-2 px-2" style={{ width: '300px' }}>
                        <span className="input-group-text bg-transparent border-0"><i className="fi fi-rr-search"></i></span>
                        <input
                            type="text"
                            className="form-control border-0 bg-transparent shadow-none"
                            placeholder="Rechercher une demande..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="px-3">
                    <span className="text-muted small fw-bold">Total : {filteredProjects.length} demandes</span>
                </div>
            </div>

            {viewMode === 'kanban' ? (
                <div className="row flex-nowrap overflow-auto pb-3 g-3">
                    {columns.map((col, i) => (
                        <DemandColumn
                            key={i}
                            {...col}
                            projects={filteredProjects.filter(p => p.status === col.status)}
                            onSignal={handleOpenSignal}
                        />
                    ))}
                </div>
            ) : (
                <div className="card border-0 shadow-sm overflow-hidden animate__animated animate__fadeIn">
                    <div className="table-responsive text-start">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr className="small text-muted text-uppercase">
                                    <th className="px-4 py-3">Projet & Lot</th>
                                    <th className="py-3">Articles</th>
                                    <th className="py-3">Budget Est.</th>
                                    <th className="py-3">Échéance</th>
                                    <th className="py-3">Statut</th>
                                    <th className="px-4 py-3 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.map(p => (
                                    <tr key={p.id}>
                                        <td className="px-4 py-3">
                                            <div className="fw-bold text-dark">{p.name}</div>
                                            <div className="small text-muted">{p.lot} • <span className="text-primary">{p.id}</span></div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="fi fi-rr-box-alt text-muted"></i>
                                                <span className="fw-bold">{p.articles}</span>
                                            </div>
                                        </td>
                                        <td className="fw-bold text-dark">{p.budget}</td>
                                        <td>
                                            <span className={`text-dark small ${p.isLate ? 'text-danger fw-bold' : ''}`}>
                                                <i className={`fi fi-rr-calendar-clock me-1 ${p.isLate ? 'text-danger' : 'text-warning'}`}></i>
                                                {p.date}
                                                {p.isLate && <span className="ms-2 badge bg-danger-subtle text-danger border-danger border px-1" style={{ fontSize: '10px' }}>RETARD</span>}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge bg-${columns.find(c => c.status === p.status)?.statusClass || 'light'} bg-opacity-10 text-${columns.find(c => c.status === p.status)?.statusClass || 'dark'} px-2 py-1`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-4 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-warning rounded-pill px-3 fw-bold"
                                                    onClick={() => handleOpenSignal(p)}
                                                >
                                                    ⚠️ Signaler
                                                </button>
                                                <Link to={`/projets/chiffrage/${p.id}`} className="btn btn-sm btn-primary rounded-pill px-3 fw-bold shadow-sm">
                                                    Chiffrer
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Signal Modal */}
            {showSignalModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__zoomIn">
                            <div className="modal-header bg-warning bg-opacity-10 border-0 p-4">
                                <h5 className="modal-title fw-bold text-dark">
                                    <i className="fi fi-rr-exclamation me-2"></i>
                                    Signaler un problème
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowSignalModal(false)}></button>
                            </div>
                            <div className="modal-body p-4 text-start">
                                <p className="text-muted small mb-3">Envoyez une alerte directe à l'entreprise concernant le projet <strong>{selectedProject?.name}</strong>.</p>

                                <label className="form-label small fw-bold text-dark">Motif du signalement</label>
                                <select
                                    className="form-select border-0 bg-light mb-3 rounded-3 shadow-none p-3"
                                    value={signalType}
                                    onChange={(e) => setSignalType(e.target.value)}
                                >
                                    <option value="retard_livraison">Retard de livraison prévu</option>
                                    <option value="prix_indisponible">Prix ou article indisponible</option>
                                    <option value="probleme_technique">Problème technique sur le dossier</option>
                                    <option value="autre">Autre motif urgent</option>
                                </select>

                                <label className="form-label small fw-bold text-dark">Message explicatif</label>
                                <textarea
                                    className="form-control border-0 bg-light rounded-3 shadow-none p-3"
                                    rows="4"
                                    placeholder="Expliquez brièvement le problème..."
                                    value={signalMessage}
                                    onChange={(e) => setSignalMessage(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="modal-footer border-0 p-4 bg-light bg-opacity-50">
                                <button type="button" className="btn btn-white border rounded-pill px-4" onClick={() => setShowSignalModal(false)}>Annuler</button>
                                <button type="button" className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm" onClick={handleSendSignal}>Envoyer le signal</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .fw-extrabold { font-weight: 800; }
                .task-list { min-height: 200px; }
                .sortable-drag { opacity: 0.8 !important; }
                .card-action:hover { border: 1px solid var(--bs-primary) !important; transform: translateY(-3px); }
                .btn-primary { background-color: #316AFF; border-color: #316AFF; }
                .btn-primary:hover { background-color: #2655cc; border-color: #2655cc; }
            `}</style>
        </>
    )
}
