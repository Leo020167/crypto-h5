import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
  children?: React.ReactNode;
}
const RequireAuth = ({ children }: RequireAuthProps) => {
  const location = useLocation();

  // if (!auth.user) {

  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return children;
};

export default RequireAuth;
