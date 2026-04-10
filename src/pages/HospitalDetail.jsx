import React, { useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, ListGroup, Stack, Button, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHospitals } from '../redux/hospitalSlice';
import { 
    IoArrowBack, IoMedical, IoNavigate, IoMap, 
    IoCall, IoStar, IoCheckmarkCircle, IoStatsChart,
    IoBusiness, IoPeople, IoLocation
} from 'react-icons/io5';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const HospitalDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { list: hospitals, status } = useSelector((state) => state.hospitals);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchHospitals());
        }
    }, [status, dispatch]);

    const hospital = useMemo(() => hospitals.find(h => h.id === id), [hospitals, id]);

    if (status === 'loading') {
        return (
            <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
                <Spinner animation="border" variant="primary" size="xl" />
                <span className="ms-3 fw-bold text-primary">Synchronizing Clinical Telemetry...</span>
            </div>
        );
    }

    if (!hospital) {
        return (
            <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center p-5 bg-white rounded-5 shadow-sm">
                    <IoMedical size={64} className="text-muted mb-4 opacity-25" />
                    <h3 className="fw-bold">Facility Not Found</h3>
                    <p className="text-muted mb-4">The medical telemetry for this unit is unavailable.</p>
                    <Button variant="primary" onClick={() => navigate('/map')} className="rounded-pill px-4">
                        Return to Mapper HUD
                    </Button>
                </div>
            </div>
        );
    }

    const { deep_details, analytics, guidance } = hospital;

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header Bridge */}
                    <div className="mb-4 d-flex align-items-center gap-3">
                        <Button variant="white" onClick={() => navigate(-1)} className="shadow-sm rounded-circle p-2 border">
                            <IoArrowBack size={24} />
                        </Button>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item"><Link to="/" className="text-muted text-decoration-none">Hospitallia</Link></li>
                                <li className="breadcrumb-item"><Link to="/map" className="text-muted text-decoration-none">Map</Link></li>
                                <li className="breadcrumb-item active fw-bold text-primary">{hospital.name}</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Hero Section */}
                    <Card className="border-0 shadow-sm rounded-5 overflow-hidden mb-5">
                        <div className="bg-primary p-4 p-md-5 text-white position-relative overflow-hidden">
                            <div className="position-relative z-index-2">
                                <Stack direction="horizontal" gap={2} className="mb-3">
                                    <Badge bg="white" text="primary" className="rounded-pill px-3 py-2">
                                        {hospital.type} Facility
                                    </Badge>
                                    <Badge bg={hospital.status === 'Available' ? 'success' : 'warning'} className="rounded-pill px-3 py-2">
                                        Status: {hospital.status}
                                    </Badge>
                                </Stack>
                                <h1 className="fw-bold mb-2 display-5">{hospital.name}</h1>
                                <p className="lead opacity-75 d-flex align-items-center gap-2 mb-0">
                                    <IoLocation /> {hospital.address}
                                </p>
                            </div>
                            <div className="position-absolute end-0 bottom-0 p-3 opacity-10">
                                <IoBusiness size={240} />
                            </div>
                        </div>
                        <Card.Body className="bg-white p-4">
                            <Row className="gy-4 align-items-center">
                                <Col md={3} className="text-center border-md-end">
                                    <div className="text-warning mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <IoStar key={i} size={20} className={i < Math.floor(hospital.rating) ? 'fill-current' : 'opacity-25'} />
                                        ))}
                                    </div>
                                    <h4 className="fw-bold mb-0">{hospital.rating} / 5.0</h4>
                                    <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px' }}>Patient Rating</small>
                                </Col>
                                <Col md={3} className="text-center border-md-end">
                                    <h4 className="fw-bold mb-0 text-primary">{deep_details?.capacity?.total_beds}</h4>
                                    <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px' }}>Global Bed Capacity</small>
                                </Col>
                                <Col md={3} className="text-center border-md-end">
                                    <h4 className="fw-bold mb-0 text-success">{analytics?.responsiveness}%</h4>
                                    <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px' }}>Responsiveness</small>
                                </Col>
                                <Col md={3} className="text-center">
                                    <Button variant="primary" className="rounded-pill w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2">
                                        <IoCall /> {hospital.phone}
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Row className="gy-4">
                        {/* Clinical Profile Left Column */}
                        <Col lg={7}>
                            <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
                                <h4 className="fw-bold mb-4">Clinical Profile</h4>
                                <p className="text-muted fs-5 mb-5 lead">
                                    {deep_details?.description}
                                </p>

                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <IoCheckmarkCircle className="text-primary" /> Core Specialties
                                </h5>
                                <div className="d-flex flex-wrap gap-2 mb-5">
                                    {deep_details?.specialties?.map((spec, i) => (
                                        <Badge key={i} bg="primary-light" text="primary" className="rounded-pill px-4 py-2 fw-normal border">
                                            {spec}
                                        </Badge>
                                    ))}
                                </div>

                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <IoBusiness className="text-primary" /> Medical Facilities
                                </h5>
                                <Row className="gy-3 mb-5">
                                    {deep_details?.facilities?.map((fac, i) => (
                                        <Col key={i} md={6}>
                                            <div className="bg-light p-3 rounded-4 d-flex align-items-center gap-3">
                                                <div className="bg-white p-2 rounded-3 shadow-sm text-primary">
                                                    <IoCheckmarkCircle />
                                                </div>
                                                <span className="fw-medium">{fac}</span>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>

                                <h5 className="fw-bold mb-3">Staffing Inventory</h5>
                                <div className="bg-light p-4 rounded-4">
                                    <Row className="text-center">
                                        {Object.entries(deep_details?.staff_stats || {}).map(([key, val]) => (
                                            <Col key={key} xs={4}>
                                                <h3 className="fw-bold mb-0 text-primary">{val}</h3>
                                                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px' }}>{key.replace('_', ' ')}</small>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </Card>

                            <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    <IoStatsChart className="text-primary" /> Patient Volume Telemetry
                                </h4>
                                <div style={{ width: '100%', height: 250 }}>
                                    <ResponsiveContainer>
                                        <AreaChart data={analytics?.monthly_patients}>
                                            <defs>
                                                <linearGradient id="colorLocal" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                            />
                                            <Area type="monotone" dataKey="count" stroke="#0d6efd" fillOpacity={1} fill="url(#colorLocal)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </Col>

                        {/* Navigation HUD Right Column */}
                        <Col lg={5}>
                            <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4 border-top border-primary border-5">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="bg-primary text-white p-3 rounded-4 shadow-sm">
                                        <IoNavigate size={32} />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold mb-1">Directional Guidance</h4>
                                        <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '10px' }}>Operational Pathing</small>
                                    </div>
                                </div>

                                <div className="mb-4 pt-3 border-top">
                                    <h6 className="fw-bold text-muted mb-3">Key Landmarks</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {guidance?.landmarks?.map((mark, i) => (
                                            <Badge key={i} bg="light" text="dark" className="rounded-pill px-3 py-2 border">
                                                <IoMap className="text-primary me-2" /> {mark}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="ps-3 border-start border-primary border-3">
                                    <h6 className="fw-bold mb-4">Step-by-Step Traversal</h6>
                                    {guidance?.step_by_step?.map((step, i) => (
                                        <div key={i} className="mb-4 position-relative">
                                            <div className="bg-primary text-white rounded-circle position-absolute d-flex align-items-center justify-content-center fw-bold" 
                                                 style={{ width: '24px', height: '24px', left: '-30px', fontSize: '12px' }}>
                                                {step.step}
                                            </div>
                                            <p className="mb-0 text-dark fw-medium">
                                                {step.instruction}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <Button 
                                    size="lg"
                                    className="w-100 rounded-pill py-3 fw-bold mt-4 shadow-sm d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => navigate('/map')}
                                >
                                    <IoMap /> View on Operational Map
                                </Button>
                            </Card>
                        </Col>

                        <Col lg={5}>
                            <Card className="border-0 shadow-sm rounded-4 p-4 bg-white">
                                <h6 className="fw-bold mb-3">Facility Meta Intelligence</h6>
                                <ListGroup variant="flush">
                                    <ListGroup.Item className="px-0 py-3 bg-transparent d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Established</span>
                                        <span className="fw-bold">1988</span>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="px-0 py-3 bg-transparent d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Emergency Wing</span>
                                        <Badge bg="success" className="rounded-pill px-3 py-2 fw-normal">Activated</Badge>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="px-0 py-3 bg-transparent d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Staff Ratio</span>
                                        <span className="fw-bold">1:4 (Patient/Nurse)</span>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </motion.div>
            </Container>
        </div>
    );
};

export default HospitalDetail;
