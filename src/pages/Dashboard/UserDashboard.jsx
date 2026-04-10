import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { IoLocate, IoShieldCheckmark, IoNotifications, IoAnalytics } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="user-dashboard-main">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-5 d-flex align-items-end justify-content-between flex-wrap gap-3">
                    <div>
                        <h2 className="fw-bold mb-1">Command Overview</h2>
                        <p className="text-muted mb-0">Telemetry active for {user?.email || 'Authenticated User'}.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2 border">
                        <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                        <small className="fw-bold text-muted">SYSTEM_READY_V2</small>
                    </div>
                </div>

                <Row className="gy-4 mb-5">
                    <Col lg={8}>
                        <Card className="dash-card border-0 p-4 bg-primary text-white overflow-hidden position-relative" style={{ minHeight: '320px' }}>
                            <div className="position-relative z-index-2 h-100 d-flex flex-column">
                                <h3 className="fw-bold mb-3">Interactive Mapper HUD</h3>
                                <p className="mb-4 opacity-75 pe-md-5 fs-5">
                                    The global hospital locator is synchronized with your current coordinates. 
                                    Access real-time diagnostic facility locations and optimized route telemetry.
                                </p>
                                <div className="mt-auto">
                                    <Button 
                                        variant="light" 
                                        className="rounded-pill px-5 py-3 fw-bold text-primary shadow-lg border-0"
                                        onClick={() => navigate('/map')}
                                    >
                                        Initialize Mapper
                                    </Button>
                                </div>
                            </div>
                            <div className="position-absolute end-0 bottom-0 p-3 opacity-25">
                                <IoLocate size={220} />
                            </div>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <Card className="dash-card border-0 p-4 h-100 bg-white shadow-sm border">
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <IoNotifications className="text-primary" />
                                <h5 className="fw-bold mb-0">Identity Status</h5>
                            </div>
                            <div className="vertical-timeline ps-3 border-start">
                                {[
                                    { title: 'Secure Session Handshake', time: 'Active', status: 'success' },
                                    { title: 'Identity Registry Sync', time: 'Verified', status: 'info' },
                                    { title: 'GPS Hardware Link', time: 'Calibrated', status: 'primary' },
                                ].map((step, idx) => (
                                    <div key={idx} className="position-relative mb-4">
                                        <div className={`bg-${step.status} rounded-circle position-absolute`} style={{ left: '-21px', top: '5px', width: '10px', height: '10px' }}></div>
                                        <h6 className="fw-bold mb-0 small">{step.title}</h6>
                                        <small className="text-muted" style={{ fontSize: '11px' }}>{step.time}</small>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-3 border-top">
                                <small className="text-muted">
                                    Your medical identity is cryptographically paired with the Hospitallia network.
                                </small>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Card className="dash-card border-0 p-4 bg-white border shadow-sm">
                    <Row className="align-items-center gy-4">
                        <Col md={8}>
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="bg-primary-light text-primary p-3 rounded-4">
                                    <IoShieldCheckmark size={32} />
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-1">Clinical Safety Protocols</h5>
                                    <p className="text-muted small mb-0">Session integrity is managed by high-altitude encryption.</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={4} className="text-md-end">
                            <Button variant="outline-primary" className="rounded-pill px-4 fw-bold" onClick={() => navigate('/dashboard/profile')}>
                                View Identity Profile
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </motion.div>
        </div>
    );
};

export default UserDashboard;
