import React, { useState } from 'react';
import { Container, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { IoMail, IoArrowBack, IoSearch } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader, addAlert } from '../redux/uiSlice';
import { supabase } from '../supabase';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');

    const handleIdentify = async (e) => {
        e.preventDefault();
        dispatch(showLoader('Locating account...'));

        try {
            const { data: exists, error } = await supabase.rpc('email_exists', {
                email_input: email
            });

            if (error) throw error;

            dispatch(hideLoader());

            if (exists) {
                dispatch(addAlert({ type: 'success', title: 'Account Verified', message: 'Identity confirmed. Initiating recovery signal.' }));
                navigate('/verify-otp', { state: { email, mode: 'recovery' } });
            } else {
                dispatch(addAlert({ 
                    type: 'error', 
                    title: 'Discovery Failure', 
                    message: 'No account found with this email address.' 
                }));
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
                        <Link to="/login" className="text-decoration-none d-inline-flex align-items-center gap-2 text-primary fw-bold">
                            <IoArrowBack /> Back to Login
                        </Link>
                    </div>

                    <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="bg-primary p-4 text-center text-white">
                            <h3 className="fw-bold mb-1">Recover Identity</h3>
                            <p className="small mb-0 opacity-75">Restore access to your Hospitallia account</p>
                        </div>
                        <Card.Body className="p-4 p-md-5">
                            <Form onSubmit={handleIdentify}>
                                <div className="text-center mb-4">
                                    <IoSearch size={48} className="text-primary opacity-25" />
                                </div>
                                
                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold">Registered Email</Form.Label>
                                    <InputGroup className="bg-light rounded-pill overflow-hidden border">
                                        <InputGroup.Text className="bg-transparent border-0 ps-3">
                                            <IoMail className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your registered email"
                                            className="bg-transparent border-0 py-2 shadow-none"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </InputGroup>
                                    <Form.Text className="text-muted ps-2">
                                        We'll check if your account exists before proceeding.
                                    </Form.Text>
                                </Form.Group>

                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    className="w-100 rounded-pill py-3 fw-bold shadow-sm"
                                >
                                    Confirm Email
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </motion.div>
            </Container>
        </div>
    );
};

export default ForgotPassword;
