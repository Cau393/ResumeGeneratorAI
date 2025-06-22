import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiresPremium = false }) => {
  const { isLoggedIn, loading, isPremium } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to pricing if premium is required but user is not premium
  if (requiresPremium && !isPremium()) {
    return <Navigate to="/pricing" replace />;
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;