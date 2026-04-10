import React from 'react';
import { useSelector } from 'react-redux';
import AccessDenied from '../../pages/AccessDenied';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <AccessDenied />;
    }

    return children;
};

export default ProtectedRoute;
