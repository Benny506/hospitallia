import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { IoSearch, IoFilter } from 'react-icons/io5';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery } from '../../redux/hospitalSlice';
import HospitalCard from './HospitalCard';
import './Hospital.css';

const HospitalSidebar = () => {
    const dispatch = useDispatch();
    const { list, searchQuery, selectedHospital } = useSelector((state) => state.hospitals);

    const filteredHospitals = list.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="hospital-sidebar h-100 d-flex flex-column bg-white shadow-lg z-index-10">
            <div className="sidebar-header p-4 border-bottom">
                <h3 className="fw-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Hospitals</h3>
                <InputGroup className="bg-light rounded-pill border-0 overflow-hidden px-2 py-1">
                    <InputGroup.Text className="bg-transparent border-0 text-muted">
                        <IoSearch />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Search hospitals, type..."
                        className="bg-transparent border-0 shadow-none px-0"
                        value={searchQuery}
                        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    />
                </InputGroup>
            </div>

            <div className="sidebar-content flex-grow-1 overflow-auto p-3 bg-light">
                {filteredHospitals.length > 0 ? (
                    filteredHospitals.map(h => (
                        <HospitalCard
                            key={h.id}
                            hospital={h}
                            isSelected={selectedHospital?.id === h.id}
                        />
                    ))
                ) : (
                    <div className="text-center py-5 text-muted">
                        <p>No hospitals found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HospitalSidebar;
