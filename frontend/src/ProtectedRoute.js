import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem('token');

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children ? children : <Outlet />;
}

export default ProtectedRoute;
