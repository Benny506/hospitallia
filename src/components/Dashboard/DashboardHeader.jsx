import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Stack } from 'react-bootstrap';
import { IoMenu } from 'react-icons/io5';

const DashboardHeader = ({ onMenuClick }) => {
    const location = useLocation();

    const getHeaderContent = () => {
        switch (location.pathname) {
            case '/dashboard':
                return {
                    title: 'Command Overview',
                    subtitle: 'Real-time telemetry and platform activity status.'
                };
            case '/dashboard/profile':
                return {
                    title: 'Medical Identity',
                    subtitle: 'Manage your verified healthcare credentials.'
                };
            default:
                return {
                    title: 'Hospitallia HUD',
                    subtitle: 'Navigating the medical frontier.'
                };
        }
    };

    const content = getHeaderContent();

    return (
        <header className="dashboard-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
                <Button 
                    variant="link" 
                    className="d-lg-none text-dark p-0" 
                    onClick={onMenuClick}
                >
                    <IoMenu size={28} />
                </Button>
                <div>
                    <h5 className="fw-bold mb-0" style={{ fontFamily: 'var(--font-heading)' }}>
                        {content.title}
                    </h5>
                    <p className="small text-muted mb-0 d-none d-md-block opacity-75">
                        {content.subtitle}
                    </p>
                </div>
            </div>

            <div className="d-flex align-items-center gap-2">
                <span className="badge bg-primary-light text-primary rounded-pill px-3 py-2 fw-normal">
                    System Online
                </span>
            </div>
        </header>
    );
};

export default DashboardHeader;
