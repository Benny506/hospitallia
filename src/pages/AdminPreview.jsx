import React, { useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHospitals } from '../redux/hospitalSlice';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { IoStatsChart, IoBusiness, IoPeople, IoAnalytics, IoPulse } from 'react-icons/io5';

const AdminPreview = () => {
    const dispatch = useDispatch();
    const { list: hospitals, status } = useSelector((state) => state.hospitals);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchHospitals());
        }
    }, [status, dispatch]);

    // Data Aggregation
    const chartData = useMemo(() => {
        if (!hospitals || hospitals.length === 0) return { flux: [], specialties: [], capacity: [] };

        // 1. Patient Flux (last 6 months avg)
        const flux = [
            { month: 'Oct', count: 0 }, { month: 'Nov', count: 0 }, 
            { month: 'Dec', count: 0 }, { month: 'Jan', count: 0 },
            { month: 'Feb', count: 0 }, { month: 'Mar', count: 0 }
        ];

        hospitals.forEach(h => {
            h.analytics?.monthly_patients?.forEach((p, idx) => {
                if (flux[idx]) flux[idx].count += p.count;
            });
        });

        // 2. Specialty Distribution
        const specialtiesMap = {};
        hospitals.forEach(h => {
            const primarySpec = h.type;
            specialtiesMap[primarySpec] = (specialtiesMap[primarySpec] || 0) + 1;
        });
        const specialties = Object.keys(specialtiesMap).map(name => ({
            name, value: specialtiesMap[name]
        }));

        // 3. Capacity vs Occupancy (Top 8)
        const capacity = hospitals.slice(0, 8).map(h => ({
            name: h.name.split(' ')[0],
            total: h.deep_details?.capacity?.total_beds || 0,
            occupied: h.deep_details?.capacity?.occupied_beds || 0
        }));

        return { flux, specialties, capacity };
    }, [hospitals]);

    const COLORS = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545', '#fd7e14', '#ffc107', '#198754'];

    const globalStats = useMemo(() => {
        const totalBeds = hospitals.reduce((acc, h) => acc + (h.deep_details?.capacity?.total_beds || 0), 0);
        const avgResponsiveness = hospitals.reduce((acc, h) => acc + (h.analytics?.responsiveness || 0), 0) / (hospitals.length || 1);
        return { totalBeds, avgResponsiveness: Math.round(avgResponsiveness) };
    }, [hospitals]);

    if (status === 'loading') {
        return (
            <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
                <Spinner animation="border" variant="primary" size="xl" />
                <span className="ms-3 fw-bold text-primary">Synchronizing Global Telemetry...</span>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                <div className="mb-5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="fw-bold mb-2">Administrative Intelligence</h1>
                        <p className="text-muted lead">Global telemetry for the Hospitallia Network.</p>
                    </motion.div>
                </div>

                <Row className="gy-4 mb-5">
                    <Col md={3}>
                        <Card className="border-0 shadow-sm p-3 rounded-4 bg-primary text-white">
                            <IoBusiness size={32} className="mb-3 opacity-75" />
                            <h2 className="fw-bold mb-0">{hospitals.length}</h2>
                            <small className="fw-bold text-uppercase opacity-75" style={{ fontSize: '10px' }}>Total Facilities</small>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0 shadow-sm p-3 rounded-4 bg-white">
                            <IoPeople size={32} className="mb-3 text-primary opacity-75" />
                            <h2 className="fw-bold mb-0">{globalStats.totalBeds}</h2>
                            <small className="fw-bold text-uppercase text-muted" style={{ fontSize: '10px' }}>Global Bed Capacity</small>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0 shadow-sm p-3 rounded-4 bg-white">
                            <IoPulse size={32} className="mb-3 text-success opacity-75" />
                            <h2 className="fw-bold mb-0">{globalStats.avgResponsiveness}%</h2>
                            <small className="fw-bold text-uppercase text-muted" style={{ fontSize: '10px' }}>Network Responsiveness</small>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0 shadow-sm p-3 rounded-4 bg-white border-start border-primary border-5">
                            <IoAnalytics size={32} className="mb-3 text-primary opacity-75" />
                            <h2 className="fw-bold mb-0">High</h2>
                            <small className="fw-bold text-uppercase text-muted" style={{ fontSize: '10px' }}>Sync Reliability</small>
                        </Card>
                    </Col>
                </Row>

                <Row className="gy-4">
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <IoStatsChart className="text-primary" /> Patient Flux Telemetry
                            </h5>
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={chartData.flux}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="#0d6efd" fillOpacity={1} fill="url(#colorCount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <Card className="border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                            <h5 className="fw-bold mb-4">Facility Distribution</h5>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={chartData.specialties}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.specialties.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                             contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>

                    <Col lg={12}>
                        <Card className="border-0 shadow-sm p-4 rounded-4 bg-white">
                            <h5 className="fw-bold mb-4">Capacity Load Efficiency (Top Facilities)</h5>
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer>
                                    <BarChart data={chartData.capacity}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            cursor={{ fill: '#f8f9fa' }}
                                            contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="total" fill="#e9ecef" name="Total Beds" radius={[10, 10, 0, 0]} />
                                        <Bar dataKey="occupied" fill="#0d6efd" name="Occupied Beds" radius={[10, 10, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminPreview;
