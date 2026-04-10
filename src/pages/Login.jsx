import React, { useState } from 'react';
import { Container, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { IoEye, IoEyeOff, IoMail, IoLockClosed, IoArrowBack } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader, addAlert } from '../redux/uiSlice';
import { supabase } from '../supabase';
import { setAuth } from '../redux/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(showLoader('Authenticating identity...'));

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            dispatch(setAuth({ session: data.session, user: data.user }));
            dispatch(hideLoader());
            dispatch(addAlert({ type: 'success', title: 'Welcome Back', message: 'Hospital network access granted.' }));
            navigate('/dashboard');
        } catch (err) {
            dispatch(hideLoader());
            dispatch(addAlert({ type: 'error', title: 'Auth Failure', message: err.message }));
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center py-5">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto"
                    style={{ maxWidth: '400px' }}
                >
                    <div className="text-center mb-4">
                        <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 text-primary fw-bold">
                            <IoArrowBack /> Back to Home
                        </Link>
                    </div>

                    <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="bg-primary p-4 text-center text-white">
                            <h3 className="fw-bold mb-1">Login</h3>
                            <p className="small mb-0 opacity-75">Access the Hospitallia locator</p>
                        </div>
                        <Card.Body className="p-4 p-md-5">
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Email Address</Form.Label>
                                    <InputGroup className="bg-light rounded-pill overflow-hidden border">
                                        <InputGroup.Text className="bg-transparent border-0 ps-3">
                                            <IoMail className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            placeholder="your@email.com"
                                            className="bg-transparent border-0 py-2 shadow-none"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold">Password</Form.Label>
                                    <InputGroup className="bg-light rounded-pill overflow-hidden border">
                                        <InputGroup.Text className="bg-transparent border-0 ps-3">
                                            <IoLockClosed className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter password"
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

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100 rounded-pill py-3 fw-bold shadow-sm mb-3"
                                >
                                    Log In
                                </Button>

                                <div className="text-center small mb-3">
                                    <Link to="/forgot-password" size="sm" className="text-muted text-decoration-none hover-text-primary">
                                        Forgot Password?
                                    </Link>
                                </div>

                                <div className="text-center small text-muted">
                                    Don't have an account? <Link to="/signup" className="text-primary fw-bold">Sign Up</Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </motion.div>
            </Container>
        </div>
    );
};

export default Login;
