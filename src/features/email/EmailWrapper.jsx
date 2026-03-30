import MailSidebar from './MailSidebar';

export default function EmailWrapper({ children }) {
    return (
        <div className="card card-body overflow-hidden mail-wrapper p-0">
            <div className="sidebar-mobile-overlay"></div>
            <MailSidebar />
            <div className="mail-body">
                {children}
            </div>
        </div>
    );
}
