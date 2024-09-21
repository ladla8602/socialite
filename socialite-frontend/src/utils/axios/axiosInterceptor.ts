import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { ROUTES } from '../../modules/core/models/route';

// Function to get the token from local storage
const getBearerToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Global variables to handle token refreshing
let isRefreshing = false;
let failedQueue: Array<(token: string) => void> = [];

// Function to process the queue after token refresh
const processQueue = (token: string) => {
  failedQueue.forEach((callback) => callback(token));
  failedQueue = [];
};

// Custom axios interceptor
export const setupInterceptors = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getBearerToken();
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      return config;
    },
    (error: AxiosError) => {
      console.error('interceptor error', error);
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      if (error.response?.status === 401) {
        if (isRefreshing) {
          // If a refresh is in progress, queue the request
          return new Promise((resolve) => {
            failedQueue.push((token: string) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            });
          });
        }

        isRefreshing = true;

        try {
          // Refresh the tokens
          // await regenerateToken();

          const token = getBearerToken();
          if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            processQueue(token);
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Failed to refresh tokens during response interceptor', refreshError);
        } finally {
          isRefreshing = false;
        }
      } else if (error.response?.status === 403) {
        // Redirect to the login page
        window.location.href = ROUTES.LOGIN; // Adjust this path according to your route setup
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};
