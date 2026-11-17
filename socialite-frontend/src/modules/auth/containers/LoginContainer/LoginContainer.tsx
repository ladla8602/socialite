import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { postRequest } from '../../../../utils/axios/apiServiceUtils';
import { ROUTES } from '../../../core/models/route';
import { setAuthToken, setUser } from '../../../core/store/slice/userSlice';
import { LoginData } from '../../interfaces/auth.interface';
import Login from '../../presentations/Login/Login';

interface LoginGraphQLResponse {
  data?: {
    login?: {
      access_token: string;
      refresh_token: string;
      user?: {
        id: string;
        username: string;
        identity: string;
        full_name?: string;
        bio?: string;
        profile?: string;
      };
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

const LoginContainer = () => {
  const [isLoader, setIsLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values: LoginData) => {
    setIsLoader(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await postRequest<LoginGraphQLResponse>('/graphql', {
        query: `
          mutation Login($loginInput: LoginInput!) {
            login(loginInput: $loginInput) {
              access_token
              refresh_token
              user {
                id
                username
                identity
                full_name
                bio
                profile
              }
            }
          }
        `,
        variables: {
          loginInput: {
            identity: values.email,
            password: values.password,
          },
        },
      });

      if (response?.errors && response.errors.length > 0) {
        throw new Error(response.errors[0]?.message || 'Invalid credentials');
      }

      const loginData = response?.data?.login;
      if (loginData?.access_token) {
        localStorage.setItem('accessToken', loginData.access_token);
        localStorage.setItem('refreshToken', loginData.refresh_token);

        dispatch(setAuthToken(true));

        if (loginData.user) {
          dispatch(
            setUser({
              id: loginData.user.id,
              email: loginData.user.identity,
              firstName: loginData.user.full_name?.split(' ')[0] || loginData.user.username,
              lastName: loginData.user.full_name?.split(' ').slice(1).join(' ') || '',
              role: 'user',
              accessToken: loginData.access_token,
              refreshToken: loginData.refresh_token,
              isVerified: true,
              phoneNo: null,
              roleId: '1',
              addedBy: null,
            }),
          );
        }

        setSuccessMessage('Logged in successfully! Redirecting...');
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 800);
      } else {
        throw new Error('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const msg =
        error?.response?.data?.errors?.[0]?.message ||
        error?.message ||
        'Unable to log in. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoader(false);
    }
  };

  return (
    <Login
      isLoader={isLoader}
      handleSubmit={handleSubmit}
      errorMessage={errorMessage}
      successMessage={successMessage}
    />
  );
};

export default LoginContainer;
