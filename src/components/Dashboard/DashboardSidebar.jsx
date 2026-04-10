import React from 'react';
import { Nav, Offcanvas, Button, Stack } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    IoGrid, IoMap, IoPerson, IoLogOut, 
    IoPlanet, IoClose, IoMedical 
} from 'react-icons/io5';
import logo from '../../assets/logo.svg';

const DashboardSidebar = ({ isMobile, show, onHide }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/dashboard', icon: <IoGrid />, label: 'Overview' },
        { path: '/map', icon: <IoMap />, label: 'Hospital Finder' },
        { path: '/dashboard/profile', icon: <IoPerson />, label: 'Medical Identity' },
        { path: '/admin', icon: <IoAnalytics />, label: 'Admin Intelligence' },
        { path: '/map', icon: <IoNavigate />, label: 'Operational Map' },
    ];

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            navigate('/login');
        }
    };

    const SidebarContent = (
        <div className="dashboard-sidebar py-4 h-100 flex-column overflow-hidden">
            <div className="px-4 mb-5 d-flex align-items-center gap-3">
                <img src={logo} alt="Hospitallia" height="40" />
                <h4 className="fw-bold mb-0 text-primary d-none d-lg-block">Hospitallia</h4>
                <div className="ms-auto d-lg-none">
                    <Button variant="link" className="text-dark p-0" onClick={onHide}>
                        <IoClose size={28} />
                    </Button>
                </div>
            </div>

            <div className="sidebar-scroll px-2">
                <Nav className="flex-column">
                    <small className="text-muted fw-bold text-uppercase px-4 mb-3 letter-spacing-wide" style={{ fontSize: '10px' }}>
                        Navigation HUD
                    </small>
                    {menuItems.map((item) => (
                        <Nav.Link 
                            key={item.path}
                            as={Link} 
                            to={item.path} 
                            className={`nav-link-dashboard ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={isMobile ? onHide : undefined}
                        >
                            {item.icon} {item.label}
                        </Nav.Link>
                    ))}
                </Nav>
            </div>

            <div className="mt-auto px-4 pt-4 border-top">
                <Button 
                    variant="link" 
                    className="text-danger fw-bold text-decoration-none d-flex align-items-center gap-2 p-0"
                    onClick={handleLogout}
                >
                    <IoLogOut size={20} /> Logout System
                </Button>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <Offcanvas show={show} onHide={onHide} placement="start" className="dashboard-offcanvas">
                <Offcanvas.Body className="p-0">
                    {SidebarContent}
                </Offcanvas.Body>
            </Offcanvas>
        );
    }

    return SidebarContent;
};

export default DashboardSidebar;
