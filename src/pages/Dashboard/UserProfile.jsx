import React from 'react';
import { Row, Col, Card, Badge, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { IoShieldCheckmark, IoMail, IoCalendar, IoAlertCircle } from 'react-icons/io5';
import { useSelector } from 'react-redux';

const UserProfile = () => {
    const { user } = useSelector((state) => state.auth);

    // Format join date if available, otherwise fallback
    const joinDate = user?.created_at 
        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Medical Registry Active';

    return (
        <div className="user-profile-main">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Row className="gy-4">
                    <Col lg={4}>
                        <Card className="dash-card border-0 p-4 text-center overflow-hidden">
                            <div className="bg-primary-light text-primary rounded-circle d-inline-flex p-4 mb-4 mx-auto" style={{ width: '100px', height: '100px' }}>
                                <IoShieldCheckmark size={52} />
                            </div>
                            <h4 className="fw-bold mb-1">Authenticated User</h4>
                            <Badge bg="success" className="rounded-pill px-3 py-2 mb-4">
                                Secure Identity V.2
                            </Badge>
                            <div className="text-start border-top pt-4">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <IoMail className="text-primary" />
                                    <div>
                                        <small className="text-muted d-block fw-bold" style={{ fontSize: '10px' }}>IDENTITY_EMAIL</small>
                                        <span className="fw-bold text-truncate d-block" style={{ maxWidth: '180px' }}>
                                            {user?.email || 'Unauthorized'}
                                        </span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <IoCalendar className="text-primary" />
                                    <div>
                                        <small className="text-muted d-block fw-bold" style={{ fontSize: '10px' }}>COMMISSION_DATE</small>
                                        <span className="fw-bold">{joinDate}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col lg={8}>
                        <Card className="dash-card border-0 p-4 p-md-5 h-100">
                            <h5 className="fw-bold mb-4">System Identity Details</h5>

                            <Alert variant="warning" className="border-0 shadow-sm rounded-4 p-4 mb-0 d-flex gap-3">
                                <IoAlertCircle size={32} className="flex-shrink-0" />
                                <div>
                                    <h6 className="fw-bold mb-1">Administrative Constraint</h6>
                                    <p className="small mb-0 opacity-75">
                                        Per healthcare auditing protocol, your <strong>Identity Email ({user?.email}) CANNOT be changed</strong>. This restriction ensures clinical data integrity and account non-repudiation across the Hospitallia network.
                                    </p>
                                </div>
                            </Alert>

                            <div className="mt-5 pt-4 border-top">
                                <p className="text-muted small">
                                    Your profile is linked to the global medical registry. All diagnostic activity and hospital tracing are cryptographically paired with this identity.
                                </p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </motion.div>
        </div>
    );
};

export default UserProfile;
