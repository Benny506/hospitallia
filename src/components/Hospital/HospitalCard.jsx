import React from 'react';
import { Card, Badge, Button, Stack } from 'react-bootstrap';
import { IoStar, IoCall, IoLocation, IoTime } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { selectHospital } from '../../redux/hospitalSlice';

const HospitalCard = ({ hospital, isSelected }) => {
    const dispatch = useDispatch();

    return (
        <Card
            className={`hospital-card mb-3 border-0 shadow-sm rounded-4 overflow-hidden ${isSelected ? 'selected' : ''}`}
            onClick={() => dispatch(selectHospital(hospital))}
            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
        >
            <Card.Body className="p-3">
                <Stack direction="horizontal" className="justify-content-between align-items-start mb-2">
                    <Badge bg={hospital.status === 'Available' ? 'success' : 'secondary'} className="rounded-pill px-2 py-1">
                        {hospital.status}
                    </Badge>
                    <div className="d-flex align-items-center gap-1 text-warning fw-bold">
                        <IoStar /> <span>{hospital.rating}</span>
                    </div>
                </Stack>

                <h5 className="fw-bold mb-1 text-dark text-truncate">{hospital.name}</h5>
                <p className="text-muted small mb-2 d-flex align-items-start gap-2">
                    <IoLocation className="mt-1 flex-shrink-0" />
                    <span>{hospital.address}</span>
                </p>

                <Stack direction="horizontal" gap={3} className="mt-3">
                    <div className="text-primary small fw-bold d-flex align-items-center gap-1">
                        <IoTime /> {hospital.type}
                    </div>
                    <div className="text-muted small d-flex align-items-center gap-1 ms-auto">
                        <IoCall /> {hospital.phone}
                    </div>
                </Stack>
            </Card.Body>
            {isSelected && (
                <div className="selected-indicator bg-primary position-absolute start-0 top-0 h-100" style={{ width: '4px' }}></div>
            )}
        </Card>
    );
};

export default HospitalCard;
