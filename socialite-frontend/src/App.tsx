import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

import LoginContainer from './modules/auth/containers/LoginContainer/LoginContainer';
import { ROUTES } from './modules/core/models/route';
import { RootState } from './modules/core/store/store';
import Dashboard from './modules/dashboard/Dashboard';

import './index.css';
import './style.css';

// PrivateRoute component to handle authentication check
const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthorized = useSelector((state: RootState) => state.userData.isAuthorized);
  return isAuthorized ? element : <Navigate to={ROUTES.LOGIN} replace />;
};

function App() {
  const isAuthorized = useSelector((state: RootState) => state.userData.isAuthorized);

  return (
    <Routes>
      {/* Login route */}
      <Route
        path={ROUTES.LOGIN}
        element={isAuthorized ? <Navigate to={ROUTES.DASHBOARD} replace /> : <LoginContainer />}
      />

      {/* Dashboard protected route */}
      <Route path={ROUTES.DASHBOARD} element={<PrivateRoute element={<Dashboard />} />} />

      {/* Default / Fallback redirect */}
      <Route
        path='*'
        element={isAuthorized ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Navigate to={ROUTES.LOGIN} replace />}
      />
    </Routes>
  );
}

export default App;
