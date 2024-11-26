import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: 'admin' | 'member';
}

function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  // For now, we'll get the role from localStorage
  // Later this should be replaced with proper authentication
  const userRole = localStorage.getItem('userRole') as 'admin' | 'member' | null;
  
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  
  if (userRole !== allowedRole) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute; 