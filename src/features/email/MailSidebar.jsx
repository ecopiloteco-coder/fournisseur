import { Link, useLocation } from 'react-router-dom';

export default function MailSidebar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="mail-sidebar bg-light">
            <div className="px-3 pt-3 mb-2">
                <Link to="/email/compose" className="btn btn-primary waves-effect waves-light w-100">
                    Compose
                </Link>
            </div>
            <div className="d-grid gap-2 p-2 mail-nav" id="myTab" role="tablist" data-simplebar>
                <Link to="/email/inbox" className={`mail-nav-item ${isActive('/email/inbox')}`}>
                    <i className="fi fi-rr-inbox-in me-2"></i> Inbox
                    <span className="badge badge-sm bg-primary-subtle text-primary ms-auto">247</span>
                </Link>
                <Link to="#" className="mail-nav-item">
                    <i className="fi fi-rr-paper-plane-top me-2"></i> Sent
                </Link>
                <Link to="#" className="mail-nav-item">
                    <i className="fi fi-rr-blueprint me-2"></i> Drafts
                </Link>
                <Link to="#" className="mail-nav-item">
                    <i className="fi fi-rr-trash me-2"></i> Trash
                </Link>
                <Link to="#" className="mail-nav-item">
                    <i className="fi fi-rr-star me-2"></i> Starred
                </Link>
                <Link to="#" className="mail-nav-item">
                    <i className="fi fi-rr-square-info me-2"></i> Spam
                </Link>
                <Link to="#" className="mail-nav-item">
                    <i className="fi fi-rr-box me-2"></i> Archive
                </Link>
                <Link to="/calendar" className="mail-nav-item">
                    <i className="fi fi-rr-calendar me-2"></i> Scheduled
                </Link>
            </div>
        </div>
    );
}
