import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

import Auth from './modules/auth/Auth';
import { ROUTES } from './modules/core/models/route';
import { RootState } from './modules/core/store/store';

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
      {/* Public routes */}
      <Route path={`/*`} element={<Auth />} />

      {/* Private routes */}
      <Route path={`${ROUTES.USER}/*`} element={<PrivateRoute element={<></>} />} />

      {/* Redirect based on auth status */}
      <Route
        path='*'
        element={
          isAuthorized ? <Navigate to={`${ROUTES.DASHBOARD}`} replace /> : <Navigate to={ROUTES.LOGIN} replace />
        }
      />
    </Routes>
  );
}

export default App;
