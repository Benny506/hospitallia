import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Stack, Badge, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoNavigate, IoLocationSharp, IoCloseCircle, IoList } from 'react-icons/io5';
import { fetchHospitals, setUserLocation, selectHospital, clearSelection, repositionHospitals } from '../redux/hospitalSlice';
import { showLoader, hideLoader, addAlert } from '../redux/uiSlice';
import HospitalSidebar from '../components/Hospital/HospitalSidebar';
import '../components/Hospital/Hospital.css';

const API_KEY = "AIzaSyDj3OCpw2YjfCX7BOAEcJImQRBsJ4utzq4"

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: 6.5244,
    lng: 3.3792
};

const HospitalMap = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list, selectedHospital, userLocation, status } = useSelector((state) => state.hospitals);
    const [map, setMap] = useState(null);
    const [activeMarker, setActiveMarker] = useState(null);
    const [showRoute, setShowRoute] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);

    const getMyLocation = useCallback((isRetry = false, silent = false) => {
        if (navigator.geolocation) {
            if (!silent) dispatch(showLoader(isRetry ? 'GPS Weak. Retrying...' : 'Locating hospital network...'));

            const options = {
                enableHighAccuracy: isRetry ? false : true,
                timeout: 8000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    dispatch(setUserLocation(pos));
                    dispatch(repositionHospitals(pos));
                    setIsDemoMode(false);
                    if (!silent) dispatch(hideLoader());
                    dispatch(addAlert({ type: 'success', title: 'GPS Lock Acquired', message: 'Real-time location verified.' }));
                },
                (error) => {
                    console.warn(`GPS Background Check (${error.code}): ${error.message}`);

                    if (!silent) {
                        dispatch(hideLoader());
                        setIsDemoMode(true);
                        const fallbackPos = center;
                        dispatch(setUserLocation(fallbackPos));
                        dispatch(repositionHospitals(fallbackPos));
                        dispatch(addAlert({
                            type: 'warning',
                            title: 'Demo Mode Active',
                            message: 'Real-time GPS unavailable. Using demo locations (will retry silently).',
                            duration: 8000
                        }));
                    }

                    // Background retry every 60s if still in demo mode
                    setTimeout(() => getMyLocation(true, true), 60000);
                },
                options
            );
        } else {
            dispatch(addAlert({ type: 'error', title: 'Unsupported', message: 'Your browser does not support geolocation.' }));
        }
    }, [dispatch]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchHospitals());
        }
        getMyLocation();
    }, [status, dispatch, getMyLocation]);

    const handleMarkerClick = (hospital) => {
        dispatch(selectHospital(hospital));
        setActiveMarker(hospital.id);
        setShowSidebar(false);
    };

    const handleGetDirections = () => {
        if (!userLocation) {
            getMyLocation();
            return;
        }
        dispatch(showLoader('Tracing direct route...'));
        setTimeout(() => {
            setShowRoute(true);
            dispatch(hideLoader());
        }, 800);
    };

    const clearRoute = () => {
        setShowRoute(false);
        dispatch(addAlert({ type: 'info', title: 'Map Cleared', message: 'Navigation path removed.' }));
    };

    return (
        <div className="hospital-map-page vh-100 d-flex flex-column overflow-hidden">
            {/* Mini Header */}
            <div className="bg-white border-bottom px-4 py-2 d-flex align-items-center justify-content-between z-index-20 shadow-sm">
                <Stack direction="horizontal" gap={3}>
                    <Button variant="link" className="text-dark p-0 fs-4" onClick={() => navigate('/')}>
                        <IoArrowBack />
                    </Button>
                    <div>
                        <h4 className="fw-bold mb-0" style={{ fontFamily: 'var(--font-heading)' }}>Interactive Map</h4>
                        <Stack direction="horizontal" gap={2} className="mt-1">
                            {isDemoMode && (
                                <Badge bg="warning" text="dark" className="fw-normal small">
                                    ⚠️ Demo Mode (OS Check Required)
                                </Badge>
                            )}
                            {showRoute && selectedHospital && (
                                <Badge bg="primary-light" className="text-primary fw-normal small">
                                    Navigating: {selectedHospital.name}
                                </Badge>
                            )}
                        </Stack>
                    </div>
                </Stack>

                <Stack direction="horizontal" gap={2}>
                    {showRoute && (
                        <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={clearRoute}>
                            <IoCloseCircle className="me-1" /> Clear
                        </Button>
                    )}
                    <Button variant="primary" size="sm" className="d-lg-none rounded-pill px-3" onClick={() => setShowSidebar(true)}>
                        <IoList className="me-1" /> List
                    </Button>
                    <span className="text-muted small d-none d-md-block">Results: {list.length}</span>
                </Stack>
            </div>

            <div className="flex-grow-1 d-flex flex-column flex-lg-row overflow-hidden position-relative">
                {/* Desktop Sidebar (visible on lg+) */}
                <div className="d-none d-lg-block border-end shadow-sm" style={{ width: '360px', zIndex: 10 }}>
                    <HospitalSidebar />
                </div>

                {/* Mobile Sidebar (Offcanvas for sm/md) */}
                <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
                    <Offcanvas.Header closeButton className="border-bottom">
                        <Offcanvas.Title className="fw-bold">Available Hospitals</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className="p-0">
                        <HospitalSidebar />
                    </Offcanvas.Body>
                </Offcanvas>

                {/* Map Area */}
                <div className="flex-grow-1 position-relative bg-light">
                    {/* Geolocation CTA Overlay (Only if not even in demo mode) */}
                    {!userLocation && !isDemoMode && (
                        <div className="position-absolute top-50 start-50 translate-middle text-center p-4 rounded-4 shadow-lg bg-white" style={{ zIndex: 100, maxWidth: '90%', width: '320px' }}>
                            <div className="bg-primary-light text-primary rounded-circle d-inline-flex p-3 mb-3">
                                <IoLocationSharp size={32} />
                            </div>
                            <h5 className="fw-bold mb-2">Location Access</h5>
                            <p className="small text-muted mb-4">Finding hospitals near you requires location access. Click below to begin detection.</p>
                            <Button variant="primary" className="w-100 rounded-pill py-2" onClick={() => getMyLocation()}>
                                Start Detection
                            </Button>
                        </div>
                    )}

                    <LoadScript googleMapsApiKey={API_KEY}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={selectedHospital ? { lat: selectedHospital.lat, lng: selectedHospital.lng } : (userLocation || center)}
                            zoom={13}
                            onLoad={(map) => setMap(map)}
                            options={{
                                styles: mapDarkStyles,
                                zoomControl: true,
                            }}
                        >
                            {/* User Location Marker */}
                            {userLocation && (
                                <Marker
                                    position={userLocation}
                                    icon={{
                                        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                                        fillColor: isDemoMode ? "#FFA500" : "#007AFF",
                                        fillOpacity: 1,
                                        strokeWeight: 4,
                                        strokeColor: "#FFFFFF",
                                        scale: 2.5
                                    }}
                                    zIndex={100}
                                    title={isDemoMode ? "Demo Position" : "Your Real Location"}
                                />
                            )}

                            {/* Hospital Markers */}
                            {list.map((hospital) => (
                                <Marker
                                    key={hospital.id}
                                    position={{ lat: hospital.lat, lng: hospital.lng }}
                                    onClick={() => handleMarkerClick(hospital)}
                                    animation={selectedHospital?.id === hospital.id && window.google ? window.google.maps.Animation.BOUNCE : null}
                                />
                            ))}

                            {/* Info Window */}
                            {selectedHospital && activeMarker && (
                                <InfoWindow
                                    position={{ lat: selectedHospital.lat, lng: selectedHospital.lng }}
                                    onCloseClick={() => {
                                        dispatch(clearSelection());
                                        setActiveMarker(null);
                                    }}
                                >
                                    <div className="p-2" style={{ maxWidth: '200px' }}>
                                        <h6 className="fw-bold mb-1">{selectedHospital.name}</h6>
                                        <p className="small text-muted mb-2">{selectedHospital.address}</p>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            className="w-100 py-1"
                                            onClick={handleGetDirections}
                                        >
                                            <IoNavigate /> Get Directions
                                        </Button>
                                    </div>
                                </InfoWindow>
                            )}

                            {/* Custom Polyline Navigation (Billing-Free) */}
                            {showRoute && userLocation && selectedHospital && (
                                <Polyline
                                    path={[
                                        { lat: userLocation.lat, lng: userLocation.lng },
                                        { lat: selectedHospital.lat, lng: selectedHospital.lng }
                                    ]}
                                    options={{
                                        strokeColor: "#6F4E37",
                                        strokeWeight: 6,
                                    }}
                                />
                            )}
                        </GoogleMap>
                    </LoadScript>

                    {/* Floating Controls */}
                    <div className="position-absolute bottom-0 end-0 m-4 d-flex flex-column gap-2" style={{ zIndex: 10 }}>
                        <Button
                            variant="white"
                            className="shadow-lg rounded-circle p-3 bg-white border"
                            onClick={() => getMyLocation()}
                            title="Refresh Location"
                        >
                            <IoLocationSharp className="text-danger fs-3" />
                        </Button>
                        <Button
                            variant="white"
                            className="shadow-lg rounded-circle p-3 bg-white border"
                            onClick={() => map && map.panTo(userLocation || center)}
                            title="Center on Me"
                        >
                            <IoLocationSharp className="text-primary fs-3" />
                        </Button>
                    </div>

                    {/* Demo Warning Banner */}
                    {isDemoMode && (
                        <div className="position-absolute start-50 translate-middle-x z-index-20" style={{ maxWidth: '95%', width: 'auto', top: '70px', marginTop: 'calc(env(safe-area-inset-top) + 0.5rem)' }}>
                            <Badge bg="dark" className="p-2 px-3 shadow-lg border border-warning rounded-pill d-flex align-items-center gap-2">
                                <span className="text-warning fw-bold d-none d-md-inline">⚠️ Presenting in Demo Mode (OS Geolocation Glitch detected)</span>
                                <span className="text-warning fw-bold d-inline d-md-none small">⚠️ Demo: OS Location Glitch</span>
                                <Button variant="outline-warning" size="sm" className="rounded-pill p-0 px-2 border-0 small" onClick={() => getMyLocation()}>Retry</Button>
                            </Badge>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const mapDarkStyles = [
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] },
    { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] },
    { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] },
    { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] },
    { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] },
    { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] },
    { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] },
    { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] },
    { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] },
    { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] },
    { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }
];

export default HospitalMap;
