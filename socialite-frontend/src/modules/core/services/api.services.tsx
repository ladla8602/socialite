/* eslint-disable react-refresh/only-export-components */
/* eslint-disable import/no-named-as-default-member */

import axios, { AxiosError, InternalAxiosRequestConfig, isAxiosError } from 'axios';
import { ReactNode, createContext, useContext } from 'react';

import { store } from '../store/store';

type ApiResponse<T = any> = T;
type ApiError = Error | AxiosError;

export interface ApiOperations {
  get: <T = any>(url: string, params?: Record<string, any>) => Promise<ApiResponse<T>>;
  post: <T = any>(
    url: string,
    body: any,
    params?: Record<string, any>,
    headers?: Record<string, any>,
  ) => Promise<ApiResponse<T>>;
  put: <T = any>(url: string, body: any) => Promise<ApiResponse<T>>;
  remove: <T = any>(url: string, body?: any, headers?: Record<string, any>) => Promise<ApiResponse<T>>;
}

interface ComponentProps {
  children?: ReactNode;
}

export const APIServiceContext = createContext<ApiOperations | null>(null);

const BEARER_TOKEN = store.getState().userData.authToken;

export const APIServiceProvider = ({ children }: ComponentProps) => {
  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      if (config.headers) {
        config.headers['authorization'] = `Bearer ${BEARER_TOKEN}`;
      }
      return config;
    },
    (error: ApiError) => {
      console.error('interceptor error', error);
      return Promise.reject(error);
    },
  );

  const handleApiError = (error: ApiError): never => {
    if (isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw error;
  };

  const get: ApiOperations['get'] = async (url, params) => {
    try {
      const { data } = await axios.get(url, { params });
      return data;
    } catch (error) {
      handleApiError(error as ApiError);
    }
  };

  const post: ApiOperations['post'] = async (url, body, params, headers) => {
    try {
      const { data } = await axios.post(url, body, { params, headers });
      return data;
    } catch (error) {
      handleApiError(error as ApiError);
    }
  };

  const put: ApiOperations['put'] = async (url, body) => {
    try {
      const { data } = await axios.put(url, body);
      return data;
    } catch (error) {
      handleApiError(error as ApiError);
    }
  };

  const remove: ApiOperations['remove'] = async (url, body, headers) => {
    try {
      const { data } = await axios.delete(url, { data: body, headers });
      return data;
    } catch (error) {
      handleApiError(error as ApiError);
    }
  };

  const ApiOperations: ApiOperations = {
    get,
    post,
    put,
    remove,
  };

  return <APIServiceContext.Provider value={ApiOperations}>{children}</APIServiceContext.Provider>;
};

export const useAPIService = (): ApiOperations => {
  const context = useContext(APIServiceContext);
  if (!context) {
    throw new Error('useAPIService must be used within an APIServiceProvider');
  }
  return context;
};
