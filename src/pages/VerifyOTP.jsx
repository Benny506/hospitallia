import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, InputGroup, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoShieldCheckmark, IoKey, IoTimer } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader, addAlert } from '../redux/uiSlice';
import axios from 'axios';
import { supabaseAnonKey } from '../supabase';

const VerifyOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { email, password, mode = 'signup' } = location.state || {};

    const [otp, setOtp] = useState('');
    const [correctOtp, setCorrectOtp] = useState('');
    const [isSending, setIsSending] = useState(true);

    const ANON_KEY = supabaseAnonKey

    useEffect(() => {
        if (!email) {
            navigate('/signup');
            return;
        }

        // Simulate OTP sending delay
        const timer = setTimeout(() => {
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setCorrectOtp(generatedOtp);
            setIsSending(false);
            dispatch(addAlert({ type: 'info', title: 'OTP Sent', message: `Verification code delivered to ${email}` }));
        }, 2500);

        return () => clearTimeout(timer);
    }, [email, navigate, dispatch]);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (otp !== correctOtp) {
            dispatch(addAlert({ type: 'error', title: 'Invalid OTP', message: 'The verification code provided is incorrect.' }));
            return;
        }

        if (mode === 'recovery') {
            dispatch(addAlert({ type: 'success', title: 'Identity Verified', message: 'MFA Clear. Proceeding to credential reset unit.' }));
            navigate('/reset-password', { state: { email } });
            return;
        }

        dispatch(showLoader('Finalizing account registration...'));

        try {
            const response = await axios.post(
                'https://tiwuhxljzjknkvplrxrg.supabase.co/functions/v1/create-only-user',
                { email, password },
                {
                    headers: {
                        'Authorization': `Bearer ${ANON_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            dispatch(hideLoader());
            dispatch(addAlert({
                type: 'success',
                title: 'Success',
                message: 'Your account has been created successfully. You can now login.'
            }));
            navigate('/login', { replace: true });
        } catch (err) {
            dispatch(hideLoader());
            console.error('Edge Function Error:', err);
            dispatch(addAlert({
                type: 'error',
                title: 'Registration Failure',
                message: err.response?.data?.error || 'Intelligence failure during account commit.'
            }));
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center py-5">
            <Container>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mx-auto"
                    style={{ maxWidth: '400px' }}
                >
                    <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="bg-primary p-4 text-center text-white">
                            <IoShieldCheckmark size={48} className="mb-2 opacity-75" />
                            <h3 className="fw-bold mb-1">Verify Identity</h3>
                            <p className="small mb-0 opacity-75">Verification for {email}</p>
                        </div>
                        <Card.Body className="p-4 p-md-5">
                            <AnimatePresence mode="wait">
                                {isSending ? (
                                    <motion.div
                                        key="sending"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center py-4"
                                    >
                                        <div className="spinner-border text-primary mb-3" role="status"></div>
                                        <p className="mono small text-muted">TRANSMITTING_OTP_SIGNAL...</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="verify"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="text-center mb-4">
                                            <p className="small text-muted mb-2">Simulated Secure Transmission Received:</p>
                                            <Badge bg="dark" className="fs-3 mono p-3 tracking-widest-2 text-warning border border-warning border-opacity-25 shadow-sm">
                                                {correctOtp}
                                            </Badge>
                                        </div>

                                        <Form onSubmit={handleVerify}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="small fw-bold">Enter Verification Code</Form.Label>
                                                <InputGroup className="bg-light rounded-pill overflow-hidden border">
                                                    <InputGroup.Text className="bg-transparent border-0 ps-3">
                                                        <IoKey className="text-muted" />
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="0 0 0 0 0 0"
                                                        className="bg-transparent border-0 py-2 shadow-none text-center mono fs-5 fw-bold"
                                                        maxLength={6}
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        required
                                                    />
                                                </InputGroup>
                                            </Form.Group>

                                            <Button
                                                type="submit"
                                                variant="primary"
                                                className="w-100 rounded-pill py-3 fw-bold shadow-sm mb-3"
                                            >
                                                {mode === 'recovery' ? 'Verify & Reset Password' : 'Verify & Create Account'}
                                            </Button>

                                            <div className="text-center small text-muted">
                                                <IoTimer className="me-1" /> OTP valid for 5 minutes
                                            </div>
                                        </Form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card.Body>
                    </Card>
                </motion.div>
            </Container>
        </div>
    );
};

export default VerifyOTP;
