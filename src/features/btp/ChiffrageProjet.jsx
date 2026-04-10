import { useState, useMemo, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNotifications } from '../../shared/providers/NotificationProvider'

export default function ChiffrageProjet() {
    const { id } = useParams()
    const { sendSignal } = useNotifications()
    const [searchTerm, setSearchTerm] = useState('')
    const [filterMissing, setFilterMissing] = useState(false)
    const [expandedArticle, setExpandedArticle] = useState(null)

    // Data Mock
    const [articles, setArticles] = useState([
        {
            id: 1,
            code: 'EL-001',
            label: 'Câble RO2V 3G1.5',
            unit: 'ml',
            qty: 150,
            price: 0,
            status: 'pending',
            description: 'Câble rigide pour installation fixe. Enveloppe PVC noire. Tension 600/1000V.',
            files: [
                { name: 'Fiche_Technique_Nexans.pdf', size: '1.2 MB' },
                { name: 'Certificat_Conformite.pdf', size: '450 KB' }
            ],
            catalogPrice: 1.45
        },
        {
            id: 2,
            code: 'EL-002',
            label: 'Disjoncteur 16A Ph+N',
            unit: 'u',
            qty: 12,
            price: 8.5,
            status: 'done',
            description: 'Disjoncteur magnéto-thermique unipolaire + neutre. Pouvoir de coupure 4.5kA.',
            files: [
                { name: 'Notice_Installation_Legrand.pdf', size: '2.1 MB' }
            ],
            catalogPrice: 9.20
        },
        {
            id: 3,
            code: 'EL-003',
            label: 'Tableau 2 rangées nu',
            unit: 'u',
            qty: 1,
            price: 0,
            status: 'pending',
            description: 'Coffret de répartition encastré ou saillie. 26 modules (2x13). Livré avec bornier terre.',
            files: [
                { name: 'Dimensions_Coffret.jpg', size: '800 KB' }
            ],
            catalogPrice: 34.00
        },
        {
            id: 4,
            code: 'EL-004',
            label: 'Applique LED 12W IP44',
            unit: 'u',
            qty: 8,
            price: 45.0,
            status: 'done',
            description: 'Luminaire mural étanche. Corps fonte d\'aluminium. 3000K (Blanc Chaud). 900 Lumens.',
            files: [
                { name: 'Schema_Montage.pdf', size: '1.5 MB' },
                { name: 'Photo_Produit.png', size: '3.2 MB' }
            ],
            catalogPrice: 48.50
        },
        {
            id: 5,
            code: 'EL-005',
            label: 'Gaine ICTA diam 20',
            unit: 'ml',
            qty: 100,
            price: 0,
            status: 'pending',
            description: 'Conduit isolant cintrable transversalement annelé. Tire-fil acier intégré.',
            files: [
                { name: 'Spécifications_ICTA.pdf', size: '900 KB' }
            ],
            catalogPrice: 0.85
        },
    ])

    const handlePriceChange = (id, value) => {
        setArticles(articles.map(a =>
            a.id === id ? { ...a, price: parseFloat(value) || 0, status: value > 0 ? 'done' : 'pending' } : a
        ))
    }

    const applyCatalogPrice = (id) => {
        const art = articles.find(a => a.id === id)
        if (art && art.catalogPrice) {
            handlePriceChange(id, art.catalogPrice)
        }
    }

    const filteredArticles = useMemo(() => {
        return articles.filter(a => {
            const matchesSearch = a.label.toLowerCase().includes(searchTerm.toLowerCase()) || a.code.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesFilter = filterMissing ? a.status === 'pending' : true
            return matchesSearch && matchesFilter
        })
    }, [articles, searchTerm, filterMissing])

    const totalHT = useMemo(() => {
        return articles.reduce((sum, a) => sum + (a.qty * a.price), 0)
    }, [articles])

    const missingCount = articles.filter(a => a.status === 'pending').length
    const completionRate = ((articles.length - missingCount) / articles.length * 100).toFixed(0)

    const toggleExpand = (id) => {
        setExpandedArticle(expandedArticle === id ? null : id)
    }

    return (
        <div className="animate__animated animate__fadeIn">
            {/* Header Area */}
            <div className="app-page-head mb-4 text-start">
                <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-3">
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-1">
                                <li className="breadcrumb-item small"><Link to="/projets/demandes">Demandes</Link></li>
                                <li className="breadcrumb-item active small" aria-current="page">Chiffrage</li>
                            </ol>
                        </nav>
                        <div className="d-flex align-items-center gap-3">
                            <h1 className="app-page-title mb-0 fs-3 fw-extrabold">Rénovation Lycée Pasteur</h1>
                            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 rounded-pill small fw-bold">#PRJ-2024-001</span>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-secondary btn-sm px-3 rounded-pill bg-white shadow-sm fw-bold">
                            <i className="fi fi-rr-disk me-1"></i> Sauvegarder
                        </button>
                        <button className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm fw-bold border-0" style={{ backgroundColor: '#316AFF' }}>
                            <i className="fi fi-rr-paper-plane me-1"></i> Envoyer le Devis
                        </button>
                    </div>
                </div>

                <div className="card border-0 shadow-sm bg-white p-3 rounded-4 overflow-hidden position-relative">
                    <div className="row align-items-center">
                        <div className="col-md-4 border-end">
                            <div className="d-flex align-items-center gap-3">
                                <div className="avatar avatar-sm bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center">
                                    <i className="fi fi-rr-clock"></i>
                                </div>
                                <div>
                                    <small className="text-muted d-block uppercase letter-spacing-1 font-xs fw-bold">ÉCHÉANCE</small>
                                    <span className="fw-bold text-dark">15 Mars 2026</span>
                                    <span className="badge bg-danger ms-2 px-2 py-1" style={{ fontSize: '9px' }}>URGENT</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 border-end">
                            <div className="d-flex align-items-center gap-3">
                                <div className="avatar avatar-sm bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center">
                                    <i className="fi fi-rr-layers"></i>
                                </div>
                                <div>
                                    <small className="text-muted d-block uppercase letter-spacing-1 font-xs fw-bold">LOT CONCERNÉ</small>
                                    <span className="fw-bold text-dark">Lot 03 - Électricité Générale</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="avatar avatar-sm bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center">
                                    <i className="fi fi-rr-check"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <small className="text-muted uppercase letter-spacing-1 font-xs fw-bold">COMPLÉTION</small>
                                        <small className="fw-bold text-success">{completionRate}%</small>
                                    </div>
                                    <div className="progress" style={{ height: '4px' }}>
                                        <div className="progress-bar bg-success" style={{ width: `${completionRate}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-5">
                {/* Main Content Area */}
                <div className="col-lg-9 text-start">
                    <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden animate__animated animate__fadeInUp">
                        <div className="card-header bg-white border-bottom p-3 d-flex gap-3 align-items-center">
                            <div className="flex-grow-1 position-relative">
                                <i className="fi fi-rr-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                <input
                                    type="text"
                                    className="form-control form-control-sm ps-5 bg-light border-light rounded-pill py-2"
                                    placeholder="Rechercher un article..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="btn-group btn-group-sm">
                                <button
                                    onClick={() => setFilterMissing(false)}
                                    className={`btn px-3 rounded-pill me-2 border-0 ${!filterMissing ? 'btn-primary shadow-sm' : 'btn-light'}`}
                                >Tous</button>
                                <button
                                    onClick={() => setFilterMissing(true)}
                                    className={`btn px-3 rounded-pill border-0 ${filterMissing ? 'btn-warning shadow-sm' : 'btn-light'}`}
                                >Manquants</button>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light bg-opacity-50">
                                    <tr className="small text-muted text-uppercase fw-bold letter-spacing-1">
                                        <th className="px-4 py-3" style={{ width: '120px' }}>Ref</th>
                                        <th className="py-3">Article & Specs</th>
                                        <th className="py-3 text-center">Quantité</th>
                                        <th className="py-3" style={{ width: '160px' }}>PU HT (€)</th>
                                        <th className="px-4 py-3 text-end" style={{ width: '160px' }}>Total HT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredArticles.map(a => (
                                        <>
                                            <tr key={`row-${a.id}`} className={`transition-all ${expandedArticle === a.id ? 'bg-primary bg-opacity-10 border-primary' : (a.status === 'pending' ? 'bg-warning bg-opacity-10' : '')}`}>
                                                <td className="px-4">
                                                    <code className="text-primary fw-bold small">{a.code}</code>
                                                </td>
                                                <td>
                                                    <div className="fw-bold text-dark">{a.label}</div>
                                                    <button
                                                        className="btn btn-link p-0 text-primary small text-decoration-none d-flex align-items-center gap-1"
                                                        onClick={() => toggleExpand(a.id)}
                                                        style={{ fontSize: '11px' }}
                                                    >
                                                        <i className={`fi fi-rr-angle-small-${expandedArticle === a.id ? 'up' : 'down'}`}></i>
                                                        {expandedArticle === a.id ? 'Cacher' : 'Détails & Fichiers'}
                                                    </button>
                                                </td>
                                                <td className="text-center">
                                                    <span className="fw-bold text-dark">{a.qty}</span>
                                                    <small className="ms-1 text-muted uppercase font-xs">{a.unit}</small>
                                                </td>
                                                <td>
                                                    <div className="position-relative">
                                                        <input
                                                            type="number"
                                                            className={`form-control form-control-sm text-end fw-bold pe-4 bg-light border-0 rounded-3 ${a.price > 0 ? 'text-success' : 'text-danger'}`}
                                                            value={a.price === 0 ? '' : a.price}
                                                            placeholder="0.00"
                                                            onChange={(e) => handlePriceChange(a.id, e.target.value)}
                                                        />
                                                        <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-muted x-small">€</span>
                                                    </div>
                                                    {a.catalogPrice > 0 && a.price === 0 && (
                                                        <button
                                                            className="btn btn-link p-0 w-100 text-end text-primary x-small mt-1 text-decoration-none"
                                                            onClick={() => applyCatalogPrice(a.id)}
                                                        >
                                                            <i className="fi fi-rr-magic-wand me-1"></i> Appliquer mon prix
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="px-4 text-end">
                                                    <span className={`fw-extrabold ${a.price > 0 ? 'text-dark' : 'text-muted'}`}>
                                                        {(a.qty * a.price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                                    </span>
                                                </td>
                                            </tr>
                                            {expandedArticle === a.id && (
                                                <tr key={`expand-${a.id}`} className="bg-primary bg-opacity-10 animate__animated animate__fadeIn">
                                                    <td colSpan="5" className="px-4 py-3 border-top-0">
                                                        <div className="row g-4">
                                                            <div className="col-md-7">
                                                                <h6 className="small fw-extrabold text-primary mb-2 uppercase letter-spacing-1">Description Technique</h6>
                                                                <p className="text-muted small mb-0 lh-base" style={{ textAlign: 'justify' }}>
                                                                    {a.description}
                                                                </p>
                                                            </div>
                                                            <div className="col-md-5">
                                                                <h6 className="small fw-extrabold text-primary mb-2 uppercase letter-spacing-1">Documents Dédiés</h6>
                                                                <div className="vstack gap-2">
                                                                    {a.files.map((f, idx) => (
                                                                        <div key={idx} className="d-flex align-items-center justify-content-between p-2 bg-white rounded-3 border">
                                                                            <div className="d-flex align-items-center gap-2 overflow-hidden">
                                                                                <i className={`fi ${f.name.endsWith('.pdf') ? 'fi-rr-file-pdf text-danger' : 'fi-rr-picture text-info'} fs-5`}></i>
                                                                                <div className="text-truncate">
                                                                                    <div className="small fw-bold text-dark text-truncate">{f.name}</div>
                                                                                    <div className="text-muted" style={{ fontSize: '9px' }}>{f.size}</div>
                                                                                </div>
                                                                            </div>
                                                                            <button className="btn btn-sm btn-light rounded-circle shadow-sm">
                                                                                <i className="fi fi-rr-download text-primary"></i>
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Sticky Area */}
                <div className="col-lg-3">
                    <div
                        className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                        <div className="card-header bg-transparent border-bottom p-4">
                            <h5 className="fw-extrabold mb-0 text-dark">Résumé Offre</h5>
                        </div>
                        <div className="card-body p-4 text-start">
                            <div className="text-center mb-4 p-4 bg-primary bg-opacity-10 rounded-4">
                                <small className="text-primary fw-bold uppercase letter-spacing-1 d-block mb-1">TOTAL HT</small>
                                <h2 className="fw-extrabold text-primary mb-0 tabular-nums">
                                    {totalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                </h2>
                            </div>

                            <div className="vstack gap-3 mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted small">Articles à chiffrer</span>
                                    <span className="fw-bold text-dark">{articles.length}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted small">Restants</span>
                                    <span className={`badge rounded-pill ${missingCount > 0 ? 'bg-warning' : 'bg-success'} text-dark fw-bold`}>
                                        {missingCount} articles
                                    </span>
                                </div>
                                <hr className="my-1 border-light" />
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted small">Taxe (TVA 20%)</span>
                                    <span className="fw-bold text-dark">{(totalHT * 0.2).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <small className="text-muted fw-bold">PROGRESSION</small>
                                    <small className="fw-extrabold text-primary">{completionRate}%</small>
                                </div>
                                <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                                    <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" style={{ width: `${completionRate}%` }}></div>
                                </div>
                            </div>

                            <div className="p-3 bg-light rounded-3 border">
                                <h6 className="small fw-extrabold text-dark mb-2 uppercase letter-spacing-1">Notes Client</h6>
                                <p className="text-muted small mb-0 lh-sm">
                                    "Merci de privilégier les matériaux de marques NF. Livraison attendue sur site."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .fw-extrabold { font-weight: 800; }
                .font-xs { font-size: 0.65rem; }
                .x-small { font-size: 0.75rem; }
                .letter-spacing-1 { letter-spacing: 0.05em; }
                .uppercase { text-transform: uppercase; }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </div>
    )
}
