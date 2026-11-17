import React, { useState } from 'react';

import Input from '../../../core/components/Input/Index';
import { LoginData } from '../../interfaces/auth.interface';

type LoginType = {
  isLoader: boolean;
  handleSubmit: (values: LoginData) => void;
  errorMessage?: string;
  successMessage?: string;
};

const Login = ({ isLoader, handleSubmit, errorMessage, successMessage }: LoginType) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setValidationError('Please enter your email or username');
      return;
    }
    if (!password) {
      setValidationError('Please enter your password');
      return;
    }
    setValidationError('');
    handleSubmit({ email: email.trim(), password });
  };

  return (
    <div className='page page-center d-flex align-items-center justify-content-center min-vh-100 bg-light'>
      <div className='container container-tight py-4'>
        <div className='text-center mb-4'>
          <h1 className='text-primary fw-bold mb-0' style={{ fontSize: '2rem' }}>
            Socialite
          </h1>
        </div>

        <div className='card card-md shadow-sm border-0'>
          <div className='card-body p-4'>
            <h2 className='h2 text-center mb-4 fw-bold'>Login to your account</h2>

            {(validationError || errorMessage) && (
              <div className='alert alert-danger alert-dismissible' role='alert'>
                <div className='d-flex'>
                  <div>{validationError || errorMessage}</div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className='alert alert-success alert-dismissible' role='alert'>
                <div className='d-flex'>
                  <div>{successMessage}</div>
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} autoComplete='off' noValidate>
              <div className='mb-3'>
                <Input
                  label='Email or Username'
                  type='text'
                  id='email'
                  name='email'
                  placeholder='your@email.com or username'
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  disabled={isLoader}
                />
              </div>

              <div className='mb-3'>
                <label className='form-label d-flex justify-content-between' htmlFor='password'>
                  <span>Password</span>
                  <a href='#' onClick={(e) => e.preventDefault()} className='form-label-description text-muted'>
                    I forgot password
                  </a>
                </label>
                <div className='input-group input-group-flat'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    className='form-control'
                    placeholder='Your password'
                    autoComplete='current-password'
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    disabled={isLoader}
                  />
                  <span className='input-group-text'>
                    <button
                      type='button'
                      className='link-secondary border-0 bg-transparent p-0'
                      title={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(!showPassword)}
                    >
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
                    </button>
                  </span>
                </div>
              </div>

              <div className='mb-3'>
                <label className='form-check'>
                  <input
                    type='checkbox'
                    className='form-check-input'
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoader}
                  />
                  <span className='form-check-label text-muted'>Remember me on this device</span>
                </label>
              </div>

              <div className='form-footer'>
                <button type='submit' className='btn btn-primary w-100 py-2' disabled={isLoader}>
                  {isLoader ? (
                    <>
                      <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
