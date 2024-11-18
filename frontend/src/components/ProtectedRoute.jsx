import React from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  // Get the token from localStorage
  const token = localStorage.getItem('token');

  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If there is a token, render the protected content
  return children;
} 