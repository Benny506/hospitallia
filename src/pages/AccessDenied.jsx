import React from 'react';
import { Container, Button, Stack } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IoShieldHalf, IoArrowBack, IoLockClosed } from 'react-icons/io5';

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
            <Container>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mx-auto"
                    style={{ maxWidth: '500px' }}
                >
                    <div className="bg-white p-5 rounded-5 shadow-lg border-bottom border-5 border-danger">
                        <div className="bg-danger-light text-danger rounded-circle d-inline-flex p-4 mb-4">
                            <IoShieldHalf size={64} />
                        </div>
                        
                        <h2 className="fw-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                            Restricted Sector
                        </h2>
                        
                        <p className="lead text-muted mb-5">
                            Access to the Command Center requires active identity clearance. 
                            Your current session is unauthorized or has expired.
                        </p>

                        <Stack direction="vertical" gap={3}>
                            <Button 
                                variant="primary" 
                                size="lg" 
                                className="w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                onClick={() => navigate('/login')}
                            >
                                <IoLockClosed /> Log In to Authenticate
                            </Button>
                            
                            <Button 
                                variant="outline-secondary" 
                                className="w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                                onClick={() => navigate('/')}
                            >
                                <IoArrowBack /> Return to Platform Gateway
                            </Button>
                        </Stack>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
};

export default AccessDenied;
