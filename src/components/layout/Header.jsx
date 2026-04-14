import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../../shared/providers/NotificationProvider'
import { useAuth } from '../../shared/providers/AuthContext'
import { MessagingPanel } from '../../shared/components/MessagingPanel'
import { NotificationsPanel } from '../../shared/components/NotificationsPanel'
import { getNotificationBackendURL } from '../../shared/lib/api-bridge'
import { jwtDecode } from 'jwt-decode'

function getKeycloakIdFromToken(token) {
    if (!token) return undefined
    try {
        const decoded = jwtDecode(token)
        return decoded?.sub
    } catch {
        return undefined
    }
}

export default function Header({ onToggleSidebar }) {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
    const { user, logout } = useAuth()
    const [showMessaging, setShowMessaging] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)

    const chatUserId = useMemo(() => {
        const token = sessionStorage.getItem('fournisseur_token')
        return user?.keycloakId || getKeycloakIdFromToken(token) || ''
    }, [user])

    useEffect(() => {
        if (!chatUserId) {
            setUnreadMessagesCount(0)
            return
        }

        const token = sessionStorage.getItem('fournisseur_token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const loadUnread = async () => {
            try {
                const res = await fetch(`${getNotificationBackendURL()}/api/chat/conversations?userId=${encodeURIComponent(chatUserId)}`, { headers })
                const json = await res.json()
                if (json?.success && Array.isArray(json.data)) {
                    const total = json.data.reduce((sum, item) => sum + Number(item?.unreadCount || 0), 0)
                    setUnreadMessagesCount(total)
                } else {
                    setUnreadMessagesCount(0)
                }
            } catch {
                setUnreadMessagesCount(0)
            }
        }

        void loadUnread()
        const timer = setInterval(loadUnread, 20000)
        return () => clearInterval(timer)
    }, [chatUserId, showMessaging])

    return (
        <>
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
                        <button 
                            onClick={() => setShowMessaging(true)}
                            className="btn btn-icon btn-action-gray rounded-circle waves-effect waves-light position-relative"
                            type="button"
                        >
                            <i className="fi fi-rr-envelope"></i>
                            {unreadMessagesCount > 0 && (
                                <span className="position-absolute top-0 end-0 p-1 mt-1 me-1 bg-danger border border-2 border-light rounded-circle">
                                    <span className="visually-hidden">New messages</span>
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setShowNotifications(true)}
                            type="button"
                            className="btn btn-icon btn-action-gray rounded-circle waves-effect waves-light position-relative"
                        >
                            <i className="fi fi-rr-bell"></i>
                            {unreadCount > 0 && (
                                <span className="position-absolute top-0 end-0 p-1 mt-1 me-1 bg-danger border border-2 border-light rounded-circle"></span>
                            )}
                        </button>
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
            <MessagingPanel isOpen={showMessaging} onClose={() => setShowMessaging(false)} />
            <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </>
    )
}
