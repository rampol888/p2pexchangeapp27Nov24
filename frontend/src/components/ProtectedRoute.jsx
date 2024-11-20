import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  // If there's no token, redirect to login with the current location
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there is a token, render the protected content
  return children;
} 