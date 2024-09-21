import { Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from '../core/models/route';
import ErrorPage from '../core/presentations/ErrorPage/ErrorPage';

import LoginContainer from './containers/LoginContainer/LoginContainer';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.PAGE_NOT_FOUND} element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.LOGIN} element={<LoginContainer />} />
      <Route path={ROUTES.BASE} element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.PAGE_NOT_FOUND} element={<ErrorPage />} />
    </Routes>
  );
};

export default AuthRoutes;
