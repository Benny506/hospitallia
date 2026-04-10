import React from 'react';
import { Card, Badge, Button, Stack } from 'react-bootstrap';
import { IoStar, IoCall, IoLocation, IoTime, IoInformationCircle } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectHospital } from '../../redux/hospitalSlice';

const HospitalCard = ({ hospital, isSelected }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMoreInfo = (e) => {
        e.stopPropagation(); // Prevent centering on map when clicking more info
        navigate(`/hospital/${hospital.id}`);
    };

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

                <Stack direction="horizontal" gap={3} className="mt-3 align-items-center">
                    <div className="text-primary small fw-bold d-flex align-items-center gap-1">
                        <IoTime /> {hospital.type}
                    </div>
                    <Button 
                        variant="primary-light" 
                        size="sm" 
                        className="rounded-pill px-3 py-1 ms-auto fw-bold text-primary d-flex align-items-center gap-1"
                        onClick={handleMoreInfo}
                        style={{ fontSize: '11px', border: '1px solid var(--bs-primary)' }}
                    >
                        <IoInformationCircle /> Info
                    </Button>
                </Stack>
            </Card.Body>
            {isSelected && (
                <div className="selected-indicator bg-primary position-absolute start-0 top-0 h-100" style={{ width: '4px' }}></div>
            )}
        </Card>
    );
};

export default HospitalCard;
