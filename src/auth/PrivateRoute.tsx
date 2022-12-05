import { Redirect, Route } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

interface RequireAuthProps {
  children: JSX.Element;
  path: string;
}
const PrivateRoute = ({ children, ...rest }: RequireAuthProps) => {
  const authStore = useAuthStore();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        authStore.userInfo ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
