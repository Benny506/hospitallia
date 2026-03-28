import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Stack } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/Navigation/NavigationBar';
import Footer from '../components/Footer/Footer';
import { IoLocate, IoNavigate, IoMedical, IoShieldCheckmark } from 'react-icons/io5';
import heroImg from '../assets/hero-bg.png';
import featuresImg from '../assets/features-bg.png';

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const targetId = hash.replace('#', '');
            const element = document.getElementById(targetId);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, []);

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    return (
        <div className="landing-page">
            <NavigationBar />

            {/* Hero Section */}
            <section id="home" className="hero-section py-5 min-vh-100 d-flex align-items-center position-relative overflow-hidden">
                <Container>
                    <Row className="align-items-center gy-5">
                        <Col lg={6}>
                            <motion.div {...fadeIn}>
                                <h6 className="text-primary fw-bold text-uppercase mb-3 letter-spacing-wide">
                                    Next-Gen Healthcare Navigation
                                </h6>
                                <h1 className="display-2 fw-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Locate care with <span className="text-primary">Confidence</span>
                                </h1>
                                <p className="lead text-muted mb-5 pe-lg-5">
                                    Hospitallia is a premium web-based hospital location system
                                    designed to provide real-time guidance and accurate mapping
                                    at your fingertips.
                                </p>
                                <Stack direction="horizontal" gap={3}>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="px-5 py-3 rounded-pill shadow-lg fw-bold"
                                        onClick={() => navigate('/map')}
                                    >
                                        Find Hospitals Now
                                    </Button>
                                    {/* <Button
                                         variant="outline-secondary"
                                         size="lg"
                                         className="px-5 py-3 rounded-pill fw-bold"
                                         href="#features"
                                     >
                                         Learn More
                                     </Button> */}
                                </Stack>
                            </motion.div>
                        </Col>
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                className="hero-image-container ps-lg-5"
                            >
                                <img
                                    src={heroImg}
                                    alt="City Medical Map"
                                    className="img-fluid rounded-5 shadow-2xl"
                                />
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Features Section */}
            <section id="features" className="py-5 bg-light">
                <Container className="py-5">
                    <motion.div {...fadeIn} className="text-center mb-5 pb-3">
                        <h2 className="display-4 fw-bold mb-3">Premium Features</h2>
                        <p className="text-muted lead mx-auto" style={{ maxWidth: '700px' }}>
                            We've built a suite of professional tools to ensure you find the
                            nearest medical facility with ease and precision.
                        </p>
                    </motion.div>

                    <Row className="gy-4">
                        {[
                            {
                                icon: <IoLocate />,
                                title: "Real-time Location",
                                desc: "Instantly detect your current position to find the nearest hospitals around you."
                            },
                            {
                                icon: <IoNavigate />,
                                title: "Smart Navigation",
                                desc: "Get accurate route indicators and turn-by-turn guidance to your destination."
                            },
                            {
                                icon: <IoMedical />,
                                title: "Facility Details",
                                desc: "Access comprehensive information about hospital facilities and specialties."
                            },
                            {
                                icon: <IoShieldCheckmark />,
                                title: "Verified Data",
                                desc: "Trust our curated database of verified medical centers and locations."
                            }
                        ].map((feature, idx) => (
                            <Col md={6} lg={3} key={idx}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="h-100 border-0 shadow-sm p-4 rounded-4">
                                        <div className="fs-1 text-primary mb-3">{feature.icon}</div>
                                        <Card.Body className="p-0">
                                            <Card.Title className="fw-bold mb-3">{feature.title}</Card.Title>
                                            <Card.Text className="text-muted">
                                                {feature.desc}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* About Section */}
            <section id="about" className="py-5">
                <Container className="py-5">
                    <Row className="align-items-center gy-5">
                        <Col lg={6} className="order-2 order-lg-1">
                            <motion.div {...fadeIn}>
                                <img
                                    src={featuresImg}
                                    alt="Mapping Interface"
                                    className="img-fluid rounded-5 shadow-lg"
                                />
                            </motion.div>
                        </Col>
                        <Col lg={6} className="order-1 order-lg-2 ps-lg-5">
                            <motion.div {...fadeIn}>
                                <h2 className="display-4 fw-bold mb-4">Our Mission</h2>
                                <p className="lead text-muted mb-4 text-justify">
                                    Hospitallia was born from the need for a faster, more intuitive
                                    way to find medical help during emergencies. We bridge the
                                    gap between users and healthcare facilities through advanced
                                    mapping technology.
                                </p>
                                <p className="text-muted mb-4 text-justify">
                                    Whether you're in a new city or need immediate assistance close to home,
                                    our platform ensures that distance is never an obstacle to quality care.
                                    We prioritize speed, accuracy, and ease of use in every interaction.
                                </p>
                                <div className="d-flex gap-4 mt-5">
                                    <div>
                                        <h3 className="fw-bold text-primary mb-0">99%</h3>
                                        <small className="text-muted fw-bold">Accuracy</small>
                                    </div>
                                    <div className="vr align-self-center mx-2" style={{ height: '40px' }}></div>
                                    <div>
                                        <h3 className="fw-bold text-primary mb-0">24/7</h3>
                                        <small className="text-muted fw-bold">Monitoring</small>
                                    </div>
                                    <div className="vr align-self-center mx-2" style={{ height: '40px' }}></div>
                                    <div>
                                        <h3 className="fw-bold text-primary mb-0">500+</h3>
                                        <small className="text-muted fw-bold">Facilities</small>
                                    </div>
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* How it Works */}
            <section className="py-5 bg-primary text-white text-center">
                <Container className="py-5">
                    <motion.div {...fadeIn}>
                        <h2 className="display-4 fw-bold mb-5">How It Works</h2>
                        <Row className="gy-5">
                            <Col md={4}>
                                <div className="display-3 fw-bold mb-3 opacity-25">01</div>
                                <h4 className="fw-bold mb-3">Detect Location</h4>
                                <p className="opacity-75">Allow GPS access or enter your location manually.</p>
                            </Col>
                            <Col md={4}>
                                <div className="display-3 fw-bold mb-3 opacity-25">02</div>
                                <h4 className="fw-bold mb-3">Browse Hospitals</h4>
                                <p className="opacity-75">Select the nearest facility from our verified list.</p>
                            </Col>
                            <Col md={4}>
                                <div className="display-3 fw-bold mb-3 opacity-25">03</div>
                                <h4 className="fw-bold mb-3">Get Directions</h4>
                                <p className="opacity-75">Follow the navigation indicators to your care center.</p>
                            </Col>
                        </Row>
                        <div className="mt-5 pt-4">
                            <Button
                                variant="light"
                                size="lg"
                                className="px-5 py-3 rounded-pill fw-bold text-primary"
                                onClick={() => navigate('/map')}
                            >
                                Experience the Map Now
                            </Button>
                        </div>
                    </motion.div>
                </Container>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
