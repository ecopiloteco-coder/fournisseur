import { Link, NavLink } from 'react-router-dom'

function MenuHeading({ label }) {
    return (
        <li className="menu-heading">
            <span className="menu-label">{label}</span>
        </li>
    )
}

export default function Sidebar({ isOpen, onToggle }) {
    const handleMouseEnter = () => {
        if (document.documentElement.getAttribute('data-app-sidebar') === 'mini') {
            document.documentElement.setAttribute('data-app-sidebar', 'mini-hover');
        }
    };

    const handleMouseLeave = () => {
        if (document.documentElement.getAttribute('data-app-sidebar') === 'mini-hover') {
            document.documentElement.setAttribute('data-app-sidebar', 'mini');
        }
    };

    const handleToggle = () => {
        if (onToggle) {
            onToggle();
        } else {
            // fallback: toggle mini mode on desktop
            const current = document.documentElement.getAttribute('data-app-sidebar');
            if (current === 'mini') {
                document.documentElement.setAttribute('data-app-sidebar', 'full');
            } else {
                document.documentElement.setAttribute('data-app-sidebar', 'mini');
            }
        }
    };

    return (
        <aside
            className={`app-menubar ${isOpen ? 'open' : ''}`}
            id="appMenubar"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* ── Brand / Logo + Toggle Button ── */}
            <div className="app-navbar-brand">
                {/* Logo full */}
                <Link className="navbar-brand-logo" to="/dashboard">
                    <img src="/assets/images/logo.svg" alt="Ecopilot Logo" />
                </Link>
                {/* Logo mini (mode réduit) */}
                <Link className="navbar-brand-mini visible-light" to="/dashboard">
                    <h4>ECO</h4>
                </Link>
                <Link className="navbar-brand-mini visible-dark" to="/dashboard">
                    <img src="/assets/images/logo-text-white.svg" alt="Ecopilot Logo" />
                </Link>

                {/* ── Bouton Fermer / Toggle Sidebar ── */}
                <button
                    className="sidebar-toggle-btn"
                    onClick={handleToggle}
                    aria-label="Fermer la sidebar"
                    title="Réduire le menu"
                >
                    <i className="fi fi-rr-angle-left sidebar-toggle-icon"></i>
                </button>
            </div>

            <nav className="app-navbar" data-simplebar="true">
                <ul className="menubar">

                    {/* ── Dashboard ── */}
                    <li className="menu-item">
                        <NavLink className="menu-link" to="/dashboard">
                            <i className="fi fi-rr-apps"></i>
                            <span className="menu-label">Dashboard Fournisseur</span>
                        </NavLink>
                    </li>

                    <MenuHeading label="Gestion des Affaires" />

                    <li className="menu-item">
                        <NavLink className="menu-link" to="/chiffrage/demandes">
                            <i className="fi fi-rr-envelope-open-dollar"></i>
                            <span className="menu-label">Demandes de Chiffrage</span>
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink className="menu-link" to="/chiffrage/devis">
                            <i className="fi fi-rr-document-signed"></i>
                            <span className="menu-label">Suivi de Projet</span>
                        </NavLink>
                    </li>

                    <MenuHeading label="Mon Catalogue" />

                    <li className="menu-item">
                        <NavLink className="menu-link" to="/catalogue/articles">
                            <i className="fi fi-rr-box-alt"></i>
                            <span className="menu-label">Mes Articles &amp; Tarifs</span>
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink className="menu-link" to="/catalogue/historique">
                            <i className="fi fi-rr-time-past"></i>
                            <span className="menu-label">Historique des Prix</span>
                        </NavLink>
                    </li>

                    <MenuHeading label="Organisation" />

                    <li className="menu-item">
                        <NavLink className="menu-link" to="/clients">
                            <i className="fi fi-rr-handshake"></i>
                            <span className="menu-label">Mes Clients</span>
                        </NavLink>
                    </li>

                    <li className="menu-item">
                        <NavLink className="menu-link" to="/equipe">
                            <i className="fi fi-rr-users"></i>
                            <span className="menu-label">Gestion de l'Équipe</span>
                        </NavLink>
                    </li>

                    <li className="menu-item">
                        <NavLink className="menu-link" to="/settings">
                            <i className="fi fi-rr-settings-sliders"></i>
                            <span className="menu-label">Configuration</span>
                        </NavLink>
                    </li>

                </ul>
            </nav>

            <div className="app-footer">
                <NavLink to="/pages/faq" className="btn btn-outline-light waves-effect btn-shadow btn-app-nav w-100">
                    <i className="fi fi-rs-interrogation text-primary"></i>
                    <span className="nav-text">Aide &amp; Support</span>
                </NavLink>
            </div>
        </aside>
    )
}
