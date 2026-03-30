import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

function MenuItem({ to, label }) {
    return (
        <li className="menu-item">
            <NavLink className="menu-link" to={to}>
                <span className="menu-label">{label}</span>
            </NavLink>
        </li>
    )
}

function MenuGroup({ label, icon, children, isOpen: initialOpen = false }) {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const location = useLocation();

    // Automatically open if a child is active
    useEffect(() => {
        const hasActiveChild = children && Array.isArray(children)
            ? children.some(child => child.props && child.props.to && location.pathname === child.props.to)
            : children?.props?.to && location.pathname === children.props.to;

        if (hasActiveChild) {
            setIsOpen(true);
        }
    }, [location.pathname, children]);

    const toggleMenu = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    return (
        <li className={`menu-item menu-arrow ${isOpen ? 'open' : ''}`}>
            <a className={`menu-link ${isOpen ? 'open' : ''}`} href="javascript:void(0);" role="button" onClick={toggleMenu}>
                {icon && <i className={`fi ${icon}`}></i>}
                <span className="menu-label">{label}</span>
            </a>
            <ul className="menu-inner" style={{ display: isOpen ? 'block' : 'none' }}>
                {children}
            </ul>
        </li>
    )
}

function MenuHeading({ label }) {
    return (
        <li className="menu-heading">
            <span className="menu-label">{label}</span>
        </li>
    )
}

export default function Sidebar({ isOpen }) {
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

    return (
        <aside
            className={`app-menubar ${isOpen ? 'open' : ''}`}
            id="appMenubar"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="app-navbar-brand">
                <Link className="navbar-brand-logo" to="/dashboard">
                    <img src="/assets/images/logo.svg" alt="Ecopilot Admin Dashboard Logo" />
                </Link>
                <Link className="navbar-brand-mini visible-light" to="/dashboard">
                    <h4>ECO PILOT</h4>
                </Link>
                <Link className="navbar-brand-mini visible-dark" to="/dashboard">
                    <img src="/assets/images/logo-text-white.svg" alt="Ecopilot Admin Dashboard Logo" />
                </Link>
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
                            <span className="menu-label">Mes Devis Envoyés</span>
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink className="menu-link" to="/suivi">
                            <i className="fi fi-rr-chart-connected"></i>
                            <span className="menu-label">Suivi de Projet</span>
                        </NavLink>
                    </li>

                    <MenuHeading label="Mon Catalogue" />

                    <li className="menu-item">
                        <NavLink className="menu-link" to="/catalogue/articles">
                            <i className="fi fi-rr-box-alt"></i>
                            <span className="menu-label">Mes Articles & Tarifs</span>
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
                        <NavLink className="menu-link" to="/equipe">
                            <i className="fi fi-rr-users"></i>
                            <span className="menu-label">Gestion de l'Équipe</span>
                        </NavLink>
                    </li>

                    <MenuGroup label="Configuration" icon="fi-rr-settings-sliders">
                        <MenuItem to="/settings" label="Profil Entreprise" />
                        <MenuItem to="/settings" label="Notifications" />
                    </MenuGroup>

                    <MenuHeading label="Outils" />

                    <li className="menu-item">
                        <NavLink className="menu-link" to="/task-management">
                            <i className="fi fi-rr-to-do"></i>
                            <span className="menu-label">Tâches</span>
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink className="menu-link" to="/calendar">
                            <i className="fi fi-rr-calendar"></i>
                            <span className="menu-label">Calendrier</span>
                        </NavLink>
                    </li>

                </ul>
            </nav>

            <div className="app-footer">
                <NavLink to="/pages/faq" className="btn btn-outline-light waves-effect btn-shadow btn-app-nav w-100">
                    <i className="fi fi-rs-interrogation text-primary"></i>
                    <span className="nav-text">Aide & Support</span>
                </NavLink>
            </div>
        </aside>
    )
}
