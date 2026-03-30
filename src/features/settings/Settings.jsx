import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Settings() {
    const [activeTab, setActiveTab] = useState('general')

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'users', label: 'Users' },
        { id: 'appearance', label: 'Appearance' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'integrations', label: 'Integrations' },
        { id: 'security', label: 'Security' },
        { id: 'backup', label: 'Backup' },
        { id: 'developer', label: 'Developer' }
    ]

    return (
        <>
            <div className="app-page-head d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Settings</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Settings</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header border-bottom bg-transparent">
                    <ul className="nav nav-underline card-header-tabs border-0" role="tablist">
                        {tabs.map(tab => (
                            <li className="nav-item" key={tab.id}>
                                <button
                                    className={`nav-link border-0 bg-transparent ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card-body">
                    {activeTab === 'general' && (
                        <div className="tab-pane fade show active text-start">
                            <h5 className="mb-4 fw-bold">Profil Entreprise</h5>
                            <form>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Nom de l'entreprise</label>
                                        <input type="text" className="form-control" defaultValue="TechnicElec IDF" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Numéro SIRET</label>
                                        <input type="text" className="form-control" defaultValue="123 456 789 00012" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Email de contact professionnel</label>
                                        <input type="email" className="form-control" defaultValue="contact@technicelec.fr" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Téléphone</label>
                                        <input type="text" className="form-control" defaultValue="+33 1 23 45 67 89" />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Adresse du siège social</label>
                                        <input type="text" className="form-control" defaultValue="45 Rue des Entrepreneurs, 75015 Paris" />
                                    </div>
                                    <div className="col-md-12 mt-4">
                                        <h6 className="fw-bold mb-3">Certifications (Labels)</h6>
                                        <div className="d-flex gap-3">
                                            <div className="form-check border p-2 rounded px-4">
                                                <input className="form-check-input" type="checkbox" id="rg" defaultChecked />
                                                <label className="form-check-label" htmlFor="rg">RGE Qualibat</label>
                                            </div>
                                            <div className="form-check border p-2 rounded px-4">
                                                <input className="form-check-input" type="checkbox" id="iso" />
                                                <label className="form-check-label" htmlFor="iso">ISO 9001</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end mt-4 pt-3 border-top">
                                    <button type="submit" className="btn btn-primary px-4 fw-bold">Enregistrer les informations</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {['users', 'integrations', 'security', 'backup', 'developer'].includes(activeTab) && (
                        <div className="text-center p-5">
                            <i className="fi fi-rr-settings text-muted display-1 opacity-25"></i>
                            <p className="text-muted mt-3">Settings for {activeTab} are coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
