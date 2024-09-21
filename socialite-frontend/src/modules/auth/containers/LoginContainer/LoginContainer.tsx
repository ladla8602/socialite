import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getRequest, postRequest } from '../../../../utils/axios/apiServiceUtils';
import { setAuthToken, setUser } from '../../../core/store/slice/userSlice';
import { LoginData } from '../../interfaces/auth.interface';
import Login from '../../presentations/Login/Login';

const LoginContainer = () => {
  const [isLoader, setIsLoader] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const header = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  // Function to get user profile
  //   const getUserProfile = async () => {
  //     const getUserData: IResponse<any> = await getRequest(API_ENDPOINTS.USER_PROFILE);
  //     return getUserData;
  //   };
  const handleSubmit = async (values: LoginData) => {
    // try {
    //   const loginData = {
    //     email: values?.email,
    //     password: values?.password,
    //   };
    //   setIsLoader(true);
    //   const { data: loginResData, statusCode: loginStatusCode }: ILoginResponse = await postRequest(
    //     AUTH_ENDPOINTS.USER_LOGIN,
    //     loginData,
    //     authUserLoginParams as Record<string, any>,
    //   );
    //   if (loginStatusCode === 201 && loginResData.user.role !== Role.SEEKER) {
    //     const tokenParamsValues = tokenParams(loginResData);
    //     const {
    //       data: getAccessToken,
    //       statusCode: getAccessTokenStatus,
    //       message: getAccessTokenMsg,
    //     }: ITokenResponseData = await postRequest(
    //       AUTH_ENDPOINTS.USER_TOKEN,
    //       tokenParamsValues,
    //       {} as Record<string, unknown>,
    //       header,
    //     );
    //     if (getAccessTokenStatus === 201) {
    //       localStorage.setItem('accessToken', getAccessToken.accessToken);
    //       localStorage.setItem('refreshToken', getAccessToken.refreshToken);
    //       // Function to regenerate token
    //       // Try to get user profile
    //       if (localStorage.getItem('accessToken')) {
    //         let getUserData = await getUserProfile();
    //         // If 401, regenerate token and try again
    //         if (getUserData.statusCode === 401 || getUserData.statusCode === 500) {
    //           await regenerateToken();
    //           getUserData = await getUserProfile();
    //         }
    //         if (getUserData.statusCode === 200) {
    //           dispatch(setUser({ ...getAccessToken, ...getUserData.data }));
    //           dispatch(setAuthToken(true));
    //           setOpenSnackbar(true);
    //           setSnackbarMessage(getAccessTokenMsg);
    //           setSnackbarSeverity('success');
    //           navigate(ROUTES.USER + ROUTES.DASHBOARD);
    //         } else {
    //           throw new Error('Failed to fetch user profile');
    //         }
    //       }
    //     }
    //   } else {
    //     setOpenSnackbar(true);
    //     setSnackbarMessage('Login Fail. As these credentials are for seeker login.');
    //     setSnackbarSeverity('error');
    //   }
    //   setIsLoader(false);
    // } catch (error: any) {
    //   setIsLoader(false);
    //   setOpenSnackbar(true);
    //   dispatch(setAuthToken(false));
    //   setSnackbarMessage(error?.message === 'fail' ? 'Invalid user credentials' : error.message);
    //   setSnackbarSeverity('error');
    // }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Login isLoader={isLoader} handleSubmit={handleSubmit} />
    </>
  );
};

export default LoginContainer;
