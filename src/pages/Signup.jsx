import React, { useState } from 'react';
import { Container, Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { IoEye, IoEyeOff, IoMail, IoLockClosed, IoArrowBack } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader, addAlert } from '../redux/uiSlice';
import { supabase } from '../supabase';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            dispatch(addAlert({ type: 'error', title: 'Mismatch', message: 'Passwords do not match.' }));
            return;
        }

        dispatch(showLoader('Verifying identity...'));

        try {
            const { data: exists, error } = await supabase.rpc('email_exists', {
                email_input: email
            });

            if (error) throw error;

            if (exists) {
                dispatch(hideLoader());
                dispatch(addAlert({ 
                    type: 'error', 
                    title: 'Conflict', 
                    message: 'This email is already registered. Use a different email or login.' 
                }));
            } else {
                dispatch(hideLoader());
                navigate('/verify-otp', { state: { email, password } });
            }
        } catch (err) {
            dispatch(hideLoader());
            dispatch(addAlert({ type: 'error', title: 'Error', message: err.message }));
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
                    <div className="text-center mb-4">
                        <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 text-primary fw-bold">
                            <IoArrowBack /> Back to Home
                        </Link>
                    </div>

                    <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="bg-primary p-4 text-center text-white">
                            <h3 className="fw-bold mb-1">Create Account</h3>
                            <p className="small mb-0 opacity-75">Join the Hospitallia health network</p>
                        </div>
                        <Card.Body className="p-4 p-md-5">
                            <Form onSubmit={handleSignup}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Email Address</Form.Label>
                                    <InputGroup className="bg-light rounded-pill overflow-hidden border">
                                        <InputGroup.Text className="bg-transparent border-0 ps-3">
                                            <IoMail className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            className="bg-transparent border-0 py-2 shadow-none"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Password</Form.Label>
                                    <InputGroup className="bg-light rounded-pill overflow-hidden border">
                                        <InputGroup.Text className="bg-transparent border-0 ps-3">
                                            <IoLockClosed className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create password"
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
                                    <Form.Label className="small fw-bold">Confirm Password</Form.Label>
                                    <InputGroup className="bg-light rounded-pill overflow-hidden border">
                                        <InputGroup.Text className="bg-transparent border-0 ps-3">
                                            <IoLockClosed className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm password"
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
                                    className="w-100 rounded-pill py-3 fw-bold shadow-sm mb-3"
                                >
                                    Proceed to Verification
                                </Button>

                                <div className="text-center small text-muted">
                                    Already have an account? <Link to="/login" className="text-primary fw-bold">Login</Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </motion.div>
            </Container>
        </div>
    );
};

export default Signup;
