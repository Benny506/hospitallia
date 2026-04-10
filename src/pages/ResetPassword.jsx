import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { IoEye, IoEyeOff, IoLockClosed, IoArrowBack, IoLockOpen } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader, addAlert } from '../redux/uiSlice';
import axios from 'axios';
import { supabase, supabaseAnonKey } from '../supabase';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { email } = location.state || {};

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const ANON_KEY = supabaseAnonKey

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleReset = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            dispatch(addAlert({ type: 'error', title: 'Mismatch', message: 'Passwords do not match.' }));
            return;
        }

        dispatch(showLoader('Synchronizing new credentials...'));

        try {
            const response = await axios.post(
                'https://tiwuhxljzjknkvplrxrg.supabase.co/functions/v1/reset-password',
                { email, new_password: password },
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
                title: 'Reset Successful',
                message: 'Your credentials have been updated. You can now login with your new password.'
            }));
            navigate('/login', { replace: true });
        } catch (err) {
            dispatch(hideLoader());
            console.error('Reset Error:', err);
            dispatch(addAlert({
                type: 'error',
                title: 'Reset Failure',
                message: err.response?.data?.error || 'Intelligence failure during credential sync.'
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
                    style={{ maxWidth: '450px' }}
                >
                    <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="bg-primary p-4 text-center text-white">
                            <IoLockOpen size={48} className="mb-2 opacity-75" />
                            <h3 className="fw-bold mb-1">New Credentials</h3>
                            <p className="small mb-0 opacity-75">Establishing secure password for {email}</p>
                        </div>
                        <Card.Body className="p-4 p-md-5">
                            <Form onSubmit={handleReset}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">New Password</Form.Label>
                                    <InputGroup className="bg-light rounded-pill overflow-hidden border">
                                        <InputGroup.Text className="bg-transparent border-0 ps-3">
                                            <IoLockClosed className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            className="bg-transparent border-0 py-2 shadow-none"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <Button
                                            variant="transparent"
                                            className="border-0 px-3"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <IoEyeOff className="text-muted" /> : <IoEye className="text-muted" />}
                                        </Button>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold">Confirm New Password</Form.Label>
                                    <InputGroup className="bg-light rounded-pill overflow-hidden border">
                                        <InputGroup.Text className="bg-transparent border-0 ps-3">
                                            <IoLockClosed className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            className="bg-transparent border-0 py-2 shadow-none"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <Button
                                            variant="transparent"
                                            className="border-0 px-3"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <IoEyeOff className="text-muted" /> : <IoEye className="text-muted" />}
                                        </Button>
                                    </InputGroup>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100 rounded-pill py-3 fw-bold shadow-sm"
                                >
                                    Force Credential Update
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </motion.div>
            </Container>
        </div>
    );
};

export default ResetPassword;
