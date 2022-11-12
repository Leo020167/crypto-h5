import { useAtomValue } from 'jotai';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { tokenAtom } from '../atoms';

interface RequireAuthProps {
  children?: React.ReactNode;
}
const RequireAuth = ({ children }: RequireAuthProps) => {
  const location = useLocation();
  const token = useAtomValue(tokenAtom);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
