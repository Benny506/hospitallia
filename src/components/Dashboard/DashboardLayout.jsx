import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import './Dashboard.css';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="dashboard-wrapper d-flex flex-column vh-100 overflow-hidden bg-light">
            <div className="d-flex flex-grow-1 overflow-hidden">
                {/* Desktop Sidebar (Persistent) */}
                <div className="d-none d-lg-block flex-shrink-0" style={{ width: '280px' }}>
                    <DashboardSidebar />
                </div>

                {/* Mobile Sidebar (Offcanvas) */}
                <DashboardSidebar 
                    isMobile={true} 
                    show={isSidebarOpen} 
                    onHide={() => setIsSidebarOpen(false)} 
                />

                {/* Main Content Area */}
                <div className="flex-grow-1 d-flex flex-column overflow-hidden position-relative">
                    <DashboardHeader onMenuClick={toggleSidebar} />
                    
                    <main className="flex-grow-1 overflow-auto p-3 p-md-4 p-xl-5">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
