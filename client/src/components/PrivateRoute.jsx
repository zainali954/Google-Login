import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        // Show a loading state while checking authentication
        return <div>Loading...</div>;
    }

    // If the user is authenticated, render the protected component
    if (user) {
        return children;
    }

    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
};

export default PrivateRoute;
