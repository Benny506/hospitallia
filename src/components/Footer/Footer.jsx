import React from 'react';
import { Container, Row, Col, Stack } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { IoLogoGithub, IoLogoTwitter, IoLogoLinkedin } from 'react-icons/io5';

const Footer = () => {
    const navigate = useNavigate();
    const location = window.location;

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
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
        <footer id="footer" className="bg-dark text-white py-5 mt-auto">
            <Container>
                <Row className="gy-4">
                    <Col lg={4}>
                        <Stack gap={3}>
                            <div className="d-flex align-items-center gap-2">
                                <img src={logo} alt="Logo" height="40" style={{ filter: 'brightness(0) invert(1)' }} />
                                <span className="fw-bold fs-4" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Hospitallia
                                </span>
                            </div>
                            <p className="text-secondary-brown mb-0">
                                Revolutionizing hospital navigation with precision and premium design.
                                Dedicated to helping you find care, faster.
                            </p>
                        </Stack>
                    </Col>
                    <Col lg={4} md={6}>
                        <h5 className="mb-4 fw-bold">Quick Links</h5>
                        <Stack gap={2}>
                            <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-white text-decoration-none opacity-75">Home</a>
                            <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="text-white text-decoration-none opacity-75">Features</a>
                            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="text-white text-decoration-none opacity-75">About Us</a>
                            <Link to="/map" className="text-white text-decoration-none opacity-75">Find Hospital</Link>
                        </Stack>
                    </Col>
                    <Col lg={4} md={6}>
                        <h5 className="mb-4 fw-bold">Connect With Us</h5>
                        <Stack direction="horizontal" gap={3} className="fs-3">
                            <a href="#" className="text-white opacity-75"><IoLogoGithub /></a>
                            <a href="#" className="text-white opacity-75"><IoLogoTwitter /></a>
                            <a href="#" className="text-white opacity-75"><IoLogoLinkedin /></a>
                        </Stack>
                        <p className="mt-4 text-secondary-brown small">
                            © 2026 Hospitallia School Project. All rights reserved.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
