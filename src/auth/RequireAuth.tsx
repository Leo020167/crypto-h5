import { useAtomValue } from 'jotai';
import { Navigate, useLocation } from 'react-router-dom';
import { tokenAtom } from '../atoms';

interface RequireAuthProps {
  children: JSX.Element;
}
const RequireAuth = ({ children }: RequireAuthProps): JSX.Element => {
  const location = useLocation();
  const token = useAtomValue(tokenAtom);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
