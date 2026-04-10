import React from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { useSelector } from 'react-redux';
import { Stack } from 'react-bootstrap';

const NavigationBar = () => {
    const navigate = useNavigate();
    const location = window.location;
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        handleClose();

        if (location.pathname === '/' || location.pathname === '/hospitallia/') {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(`/#${targetId}`);
        }
    };

    return (
        <Navbar expand="lg" className="bg-white py-3 sticky-top shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                    <img src={logo} alt="Logo" height="40" />
                    <span className="fw-bold fs-4 text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                        Hospitallia
                    </span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" onClick={handleShow} />

                <Navbar.Offcanvas
                    id="offcanvasNavbar-expand-lg"
                    aria-labelledby="offcanvasNavbarLabel-expand-lg"
                    placement="end"
                    show={show}
                    onHide={handleClose}
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg" className="fw-bold text-primary">
                            Hospitallia
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-center flex-grow-1 pe-3">
                            <Nav.Link href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</Nav.Link>
                            <Nav.Link href="#features" onClick={(e) => handleNavClick(e, 'features')}>Features</Nav.Link>
                            <Nav.Link href="#about" onClick={(e) => handleNavClick(e, 'about')}>About Us</Nav.Link>
                            <Nav.Link as={Link} to="/admin" className="text-primary fw-bold">Admin Intelligence</Nav.Link>
                        </Nav>
                        {isAuthenticated ? (
                            <Button
                                variant="primary"
                                className="px-4 py-2 rounded-pill fw-bold shadow-sm"
                                onClick={() => {
                                    handleClose();
                                    navigate('/dashboard');
                                }}
                            >
                                Dashboard HUD
                            </Button>
                        ) : (
                            <>
                                <Stack direction="horizontal" gap={3} className="d-none d-lg-flex">
                                    <Nav.Link as={Link} to="/login" className="fw-bold text-dark">Log In</Nav.Link>
                                    <Button
                                        variant="primary"
                                        className="px-4 py-2 rounded-pill fw-bold shadow-sm"
                                        onClick={() => {
                                            handleClose();
                                            navigate('/signup');
                                        }}
                                    >
                                        Join Network
                                    </Button>
                                </Stack>

                                {/* Mobile view buttons */}
                                <div className="d-lg-none mt-3 d-flex flex-column gap-2">
                                    <Button 
                                        variant="outline-primary" 
                                        className="rounded-pill fw-bold"
                                        onClick={() => {
                                            handleClose();
                                            navigate('/login');
                                        }}
                                    >
                                        Log In
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="rounded-pill fw-bold"
                                        onClick={() => {
                                            handleClose();
                                            navigate('/signup');
                                        }}
                                    >
                                        Join Now
                                    </Button>
                                </div>
                            </>
                        )}
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
