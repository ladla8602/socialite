import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../core/models/route';
import { resetUserState } from '../core/store/slice/userSlice';
import { RootState } from '../core/store/store';

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.userData.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(resetUserState());
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className='page'>
      <header className='navbar navbar-expand-md navbar-light d-print-none border-bottom bg-white'>
        <div className='container-xl'>
          <h1 className='navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3 text-primary fw-bold'>
            Socialite
          </h1>
          <div className='navbar-nav flex-row order-md-last ms-auto'>
            <div className='nav-item dropdown d-flex align-items-center'>
              <span className='me-3 text-muted'>
                Logged in as <strong>{user?.firstName || user?.email || 'User'}</strong>
              </span>
              <button onClick={handleLogout} className='btn btn-outline-danger btn-sm'>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className='page-wrapper'>
        <div className='container-xl py-5'>
          <div className='row justify-content-center'>
            <div className='col-md-8'>
              <div className='card shadow-sm border-0'>
                <div className='card-status-top bg-primary'></div>
                <div className='card-body text-center py-5'>
                  <div className='avatar avatar-xl rounded-circle bg-primary-lt mb-3' style={{ fontSize: '2rem' }}>
                    {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <h2 className='card-title mb-1'>Welcome to Socialite, {user?.firstName || 'User'}!</h2>
                  <p className='text-muted mb-4'>You have successfully authenticated via GraphQL.</p>

                  <div className='row g-3 justify-content-center'>
                    <div className='col-sm-6 text-start'>
                      <div className='list-group list-group-flush'>
                        <div className='list-group-item d-flex justify-content-between'>
                          <span className='text-muted'>Email:</span>
                          <span className='fw-bold'>{user?.email || 'N/A'}</span>
                        </div>
                        <div className='list-group-item d-flex justify-content-between'>
                          <span className='text-muted'>User ID:</span>
                          <span className='text-truncate' style={{ maxWidth: '180px' }}>
                            {user?.id || 'N/A'}
                          </span>
                        </div>
                        <div className='list-group-item d-flex justify-content-between'>
                          <span className='text-muted'>Status:</span>
                          <span className='badge bg-success-lt'>Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
