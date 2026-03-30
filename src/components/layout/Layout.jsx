import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

import SidebarRight from './SidebarRight'

export default function Layout() {
    const [isSidebarMini, setIsSidebarMini] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Toggle mini sidebar for desktop
    const toggleSidebar = () => {
        if (window.innerWidth >= 1191) {
            setIsSidebarMini(!isSidebarMini);
        } else {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Update document attributes to reflect sidebar state
    useEffect(() => {
        document.documentElement.setAttribute('data-app-sidebar', isSidebarMini ? 'mini' : 'full');
    }, [isSidebarMini]);

    return (
        <div className={`page-layout ${isSidebarOpen ? 'layout-sidebar-open' : ''}`}>
            <Header onToggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} />
            <SidebarRight />
            <main className="app-wrapper">
                <div className="container">
                    <Outlet />
                </div>
            </main>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="sidebar-mobile-overlay show"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    )
}
