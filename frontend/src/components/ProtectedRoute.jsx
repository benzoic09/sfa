import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  // Retrieve the user's role from localStorage
  const userRole = localStorage.getItem('role');

  // Check if a user role exists and if it's included in the allowed roles
  if (!userRole || !allowedRoles.includes(userRole)) {
    // If not authorized, redirect to the '/unauthorized' route
    return <Navigate to="/unauthorized" replace />;
  }

  // If authorized, render the child routes or the provided children
  return children ? children : <Outlet />;
};

export default ProtectedRoute;