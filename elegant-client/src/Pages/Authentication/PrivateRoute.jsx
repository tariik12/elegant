
// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Provider/AuthProvier';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to='/login@elegant-admin' replace />;
};

export default PrivateRoute;
