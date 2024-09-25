import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ authenticate, children }) => {
    if (!authenticate()) {
        return <Navigate to="/form/login" replace />
    }

    return children;
};

export default ProtectedRoute