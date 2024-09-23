import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setAuthToken } from '../core/store/slice/userSlice';

import AuthRoutes from './AuthRoutes';

const Auth = () => {
  const dispath = useDispatch();

  useEffect(() => {
    dispath(setAuthToken(false));
  }, []);

  return (
    <>
      <AuthRoutes />
    </>
  );
};

export default Auth;
