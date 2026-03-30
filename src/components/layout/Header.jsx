import { Link } from 'react-router-dom'
import { useNotifications } from '../../shared/providers/NotificationProvider'
import { useAuth } from '../../shared/providers/AuthContext'

export default function Header({ onToggleSidebar }) {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
    const { user, logout } = useAuth()

    return (
        <header className="app-header">
            <div className="app-header-inner">
                <button
                    className="app-toggler"
                    type="button"
                    aria-label="app toggler"
                    onClick={onToggleSidebar}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className="app-header-start d-none d-md-flex">
                    <form className="d-flex align-items-center h-100 w-lg-250px w-xxl-300px position-relative" action="#">
                        <button type="button" className="btn btn-sm border-0 position-absolute start-0 ms-3 p-0">
                            <i className="fi fi-rr-search"></i>
                        </button>
                        <input
                            type="text"
                            className="form-control rounded-5 ps-5"
                            placeholder="Search anything's"
                            data-bs-toggle="modal"
                            data-bs-target="#searchResultsModal"
                        />
                    </form>
                    <ul className="navbar-nav gap-4 flex-row d-none d-xxl-flex">
                        <li className="nav-item">
                            <Link className="nav-link" to="/analytics">Reports &amp; Analytics</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/pages/faq">Help</Link>
                        </li>
                    </ul>
                </div>
                <div className="app-header-end">
                    <div className="px-lg-3 px-2 ps-0 d-flex align-items-center">
                        <div className="dropdown">
                            <button
                                className="btn btn-icon btn-action-gray rounded-circle waves-effect waves-light position-relative"
                                id="ld-theme"
                                type="button"
                                data-bs-auto-close="outside"
                                aria-expanded="false"
                                data-bs-toggle="dropdown"
                            >
                                <i className="fi fi-rr-brightness scale-1x theme-icon-active"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button type="button" className="dropdown-item d-flex gap-2 align-items-center" data-bs-theme-value="light" aria-pressed="false">
                                        <i className="fi fi-rr-brightness scale-1x" data-theme="light"></i> Light
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="dropdown-item d-flex gap-2 align-items-center" data-bs-theme-value="dark" aria-pressed="false">
                                        <i className="fi fi-rr-moon scale-1x" data-theme="dark"></i> Dark
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="dropdown-item d-flex gap-2 align-items-center" data-bs-theme-value="auto" aria-pressed="true">
                                        <i className="fi fi-br-circle-half-stroke scale-1x" data-theme="auto"></i> Auto
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="vr my-3"></div>
                    <div className="d-flex align-items-center gap-sm-2 gap-0 px-lg-4 px-sm-2 px-1">
                        <Link to="/email/inbox" className="btn btn-icon btn-action-gray rounded-circle waves-effect waves-light position-relative">
                            <i className="fi fi-rr-envelope"></i>
                            <span className="position-absolute top-0 end-0 p-1 mt-1 me-1 bg-danger border border-3 border-light rounded-circle">
                                <span className="visually-hidden">New alerts</span>
                            </span>
                        </Link>
                        <div className="dropdown text-end">
                            <button
                                type="button"
                                className="btn btn-icon btn-action-gray rounded-circle waves-effect waves-light"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                                aria-expanded="true"
                            >
                                <i className="fi fi-rr-bell"></i>
                                {unreadCount > 0 && (
                                    <span className="position-absolute top-0 end-0 p-1 mt-1 me-1 bg-danger border border-2 border-light rounded-circle"></span>
                                )}
                            </button>
                            <div className="dropdown-menu dropdown-menu-lg-end p-0 w-350px mt-2 overflow-hidden shadow-lg border-0 rounded-4">
                                <div className="px-3 py-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                                    <h6 className="mb-0 fw-bold">Notifications <span className="badge badge-sm rounded-pill bg-primary ms-2">{unreadCount}</span></h6>
                                    <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={markAllAsRead}>Mark all read</button>
                                </div>
                                <div className="p-0" style={{ maxHeight: 350, overflowY: 'auto' }} data-simplebar>
                                    <ul className="list-group list-group-flush">
                                        {notifications.length > 0 ? (
                                            notifications.map(n => (
                                                <li
                                                    key={n.id}
                                                    className={`list-group-item list-group-item-action border-0 px-3 py-3 ${!n.read ? 'bg-primary bg-opacity-05' : ''}`}
                                                    onClick={() => markAsRead(n.id)}
                                                    role="button"
                                                >
                                                    <div className="d-flex">
                                                        <div className={`avatar avatar-xs rounded-circle bg-${n.type}-subtle text-${n.type} fs-6 flex-shrink-0`}>
                                                            <i className={`fi ${n.type === 'primary' ? 'fi-rr-star' : n.type === 'warning' ? 'fi-rr-exclamation' : 'fi-rr-info'}`}></i>
                                                        </div>
                                                        <div className="ms-3 flex-grow-1 position-relative">
                                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                                <h6 className="mb-0 small fw-bold">{n.title}</h6>
                                                                <small className="text-muted" style={{ fontSize: '10px' }}>{n.time}</small>
                                                            </div>
                                                            <p className="text-muted small mb-0 lh-sm pe-2">{n.desc}</p>
                                                            {!n.read && <span className="position-absolute end-0 top-50 translate-middle-y p-1 bg-primary rounded-circle"></span>}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <div className="p-5 text-center text-muted">
                                                <i className="fi fi-rr-bell-slash fs-1 d-block mb-3 opacity-25"></i>
                                                No notifications
                                            </div>
                                        )}
                                    </ul>
                                </div>
                                <div className="p-2 border-top bg-light">
                                    <Link to="/notifications" className="btn btn-link btn-sm w-100 text-primary fw-bold text-decoration-none">View all history</Link>
                                </div>
                            </div>
                        </div>
                        <Link to="/calendar" className="btn btn-icon btn-action-gray rounded-circle waves-effect waves-light">
                            <i className="fi fi-rr-calendar"></i>
                        </Link>
                    </div>
                    <div className="vr my-3"></div>
                    <div className="dropdown text-end ms-sm-3 ms-2 ms-lg-4">
                        <a href="#" className="d-flex align-items-center py-2" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="true">
                            <div className="text-end me-2 d-none d-lg-inline-block">
                                <div className="fw-bold text-dark">{user?.nomEntreprise || 'Fournisseur'}</div>
                                <small className="text-body d-block lh-sm" style={{ textTransform: 'capitalize' }}>
                                    <i className="fi fi-rr-angle-down text-3xs me-1"></i> {user?.role ? user.role.replace('ADMIN_', '').toLowerCase() : 'Admin'}
                                </small>
                            </div>
                            <div className="avatar avatar-sm rounded-circle avatar-status-success">
                                <img src="/assets/images/avatar/avatar1.webp" alt="" />
                            </div>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end w-225px mt-1">
                            <li className="d-flex align-items-center p-2">
                                <div className="avatar avatar-sm rounded-circle">
                                    <img src="/assets/images/avatar/avatar1.webp" alt="" />
                                </div>
                                <div className="ms-2">
                                    <div className="fw-bold text-dark">{user?.nomEntreprise || 'Fournisseur'}</div>
                                    <small className="text-body d-block lh-sm">{user?.email || 'contact@fournisseur.com'}</small>
                                </div>
                            </li>
                            <li><div className="dropdown-divider my-1"></div></li>
                            <li><Link className="dropdown-item d-flex align-items-center gap-2" to="/profile"><i className="fi fi-rr-user scale-1x"></i> View Profile</Link></li>
                            <li><Link className="dropdown-item d-flex align-items-center gap-2" to="/task-management"><i className="fi fi-rr-note scale-1x"></i> My Task</Link></li>
                            <li><Link className="dropdown-item d-flex align-items-center gap-2" to="/pages/faq"><i className="fi fi-rs-interrogation scale-1x"></i> Help Center</Link></li>
                            <li><Link className="dropdown-item d-flex align-items-center gap-2" to="/settings"><i className="fi fi-rr-settings scale-1x"></i> Account Settings</Link></li>
                            <li><Link className="dropdown-item d-flex align-items-center gap-2" to="/pages/pricing"><i className="fi fi-rr-usd-circle scale-1x"></i> Upgrade Plan</Link></li>
                            <li><div className="dropdown-divider my-1"></div></li>
                            <li><button onClick={logout} className="dropdown-item d-flex align-items-center gap-2 text-danger border-0 bg-transparent w-100 text-start"><i className="fi fi-sr-exit scale-1x"></i> Log Out</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )
}
