import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface PrivateRouteProps {
    children: React.ReactElement;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    return authService.isAuthenticated() ? children : <Navigate to="/login" replace />;
};
