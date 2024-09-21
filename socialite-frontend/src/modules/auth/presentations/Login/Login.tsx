import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as Yup from 'yup';

import Input from '../../../core/components/Input/Index';
import { REGEX } from '../../../core/models/regex';
import { LoginData } from '../../interfaces/auth.interface';

type LoginType = {
  isLoader: boolean;
  handleSubmit: (values: LoginData) => void;
};

const Login = ({ isLoader, handleSubmit }: LoginType) => {
  const navigate = useLocation();

  const validationSchema = Yup.object({
    email: Yup.string().matches(REGEX.EMAIL, 'Enter a valid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const initialValues = {
    email: '',
    password: '',
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className='page page-center'>
        <div className='container container-normal py-4'>
          <div className='row align-items-center g-4'>
            <div className='col-lg'>
              <div className='container-tight'>
                <div className='text-center mb-4'>
                  <a href='.' className='navbar-brand navbar-brand-autodark'>
                    <img src='./static/logo.svg' height='36' alt='' />
                  </a>
                </div>
                <div className='card card-md'>
                  <div className='card-body'>
                    <h2 className='h2 text-center mb-4'>Login to your account</h2>
                    <form action='./' method='get' autoComplete='off' noValidate>
                      <div className='mb-3'>
                        <Input label='Email address' type='email' placeholder='your@email.com' />
                      </div>
                      <div className='mb-2'>
                        <label className='form-label'>
                          Password
                          <span className='form-label-description'>
                            <a href='./forgot-password.html'>I forgot password</a>
                          </span>
                        </label>
                        <div className='input-group input-group-flat'>
                          <input
                            type='password'
                            className='form-control'
                            placeholder='Your password'
                            autoComplete='off'
                          />
                          <span className='input-group-text'>
                            <a href='#' className='link-secondary' title='Show password' data-bs-toggle='tooltip'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='icon'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                strokeWidth='2'
                                stroke='currentColor'
                                fill='none'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              >
                                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0' />
                                <path d='M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6' />
                              </svg>
                            </a>
                          </span>
                        </div>
                      </div>
                      <div className='mb-2'>
                        <label className='form-check'>
                          <input type='checkbox' className='form-check-input' />
                          <span className='form-check-label'>Remember me on this device</span>
                        </label>
                      </div>
                      <div className='form-footer'>
                        <button type='submit' className='btn btn-primary w-100'>
                          Sign in
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg d-none d-lg-block'>
              <img
                src='./static/illustrations/undraw_secure_login_pdn4.svg'
                height='300'
                className='d-block mx-auto'
                alt=''
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
