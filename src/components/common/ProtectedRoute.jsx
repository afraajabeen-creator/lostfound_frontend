import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Route protection wrapper based on JWT authentication and user role.
 * 
 * VIVA TIP:
 * Prevents unauthorized URL access by inspecting the user's role and auth status
 * before rendering children components.
 */
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to correct dashboard based on actual role
    const redirectPath = user?.role === 'ROLE_ADMIN' ? '/admin' : '/student';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
