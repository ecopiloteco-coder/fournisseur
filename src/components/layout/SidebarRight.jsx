export default function SidebarRight() {
    return (
        <div className="app-sidebar-end">
            <ul className="sidebar-list">
                <li>
                    <a href="#/task-management">
                        <div className="avatar avatar-sm bg-warning shadow-sharp-warning rounded-circle text-white mx-auto mb-2">
                            <i className="fi fi-rr-to-do"></i>
                        </div>
                        <span className="text-dark">Task</span>
                    </a>
                </li>
                <li>
                    <a href="#/pages/faq">
                        <div className="avatar avatar-sm bg-secondary shadow-sharp-secondary rounded-circle text-white mx-auto mb-2">
                            <i className="fi fi-rr-interrogation"></i>
                        </div>
                        <span className="text-dark">Help</span>
                    </a>
                </li>
                <li>
                    <a href="#/calendar">
                        <div className="avatar avatar-sm bg-info shadow-sharp-info rounded-circle text-white mx-auto mb-2">
                            <i className="fi fi-rr-calendar"></i>
                        </div>
                        <span className="text-dark">Event</span>
                    </a>
                </li>
                <li>
                    <a href="#/settings">
                        <div className="avatar avatar-sm bg-gray shadow-sharp-gray rounded-circle text-white mx-auto mb-2">
                            <i className="fi fi-rr-settings"></i>
                        </div>
                        <span className="text-dark">Settings</span>
                    </a>
                </li>
            </ul>
        </div>
    );
}
