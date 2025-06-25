// components/ProtectedAdminRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedAdminRoute = ({ children }) => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (authUser.userType !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
