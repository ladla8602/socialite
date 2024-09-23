import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import { setupInterceptors } from './axiosInterceptor';
import { ApiOperations, CustomErrorHandler } from './types';

// Create and configure axios instance
const axiosInstance: AxiosInstance = setupInterceptors(axios.create());

// Default headers
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Generic error handling function
const handleApiError = (error: unknown): never => {
  // eslint-disable-next-line import/no-named-as-default-member
  if (axios.isAxiosError(error)) {
    throw error.response?.data || error;
  }
  throw error;
};

// Custom error handlers for each method
const errorHandlers: Record<string, CustomErrorHandler> = {
  get: (error: AxiosError) => {
    console.error('GET request failed:', error.message);
    // Add custom logic for GET errors
    return handleApiError(error);
  },
  post: (error: AxiosError) => {
    console.error('POST request failed:', error.message);
    // Add custom logic for POST errors
    return handleApiError(error);
  },
  put: (error: AxiosError) => {
    console.error('PUT request failed:', error.message);
    // Add custom logic for PUT errors
    return handleApiError(error);
  },
  delete: (error: AxiosError) => {
    console.error('DELETE request failed:', error.message);
    // Add custom logic for DELETE errors
    return handleApiError(error);
  },
};

// Generic request function
const request = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  try {
    const { data } = await axiosInstance.request<T>({
      method,
      url,
      ...config,
      headers: { ...defaultHeaders, ...config.headers },
    });
    return data;
  } catch (error) {
    // eslint-disable-next-line import/no-named-as-default-member
    if (axios.isAxiosError(error) && error.response) {
      return errorHandlers[method](error);
    }
    return handleApiError(error);
  }
};

// API operations
export const apiOperations: ApiOperations = {
  getRequest: (url, params) => request('get', url, { params }),
  postRequest: (url, data, params, headers) => {
    const config: AxiosRequestConfig = { data, params, headers };
    if (data instanceof FormData) {
      config.headers = {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      };
    }
    return request('post', url, config);
  },
  putRequest: (url, data) => request('put', url, { data }),
  removeRequest: (url, data, headers) => request('delete', url, { data, headers }),
};

export const { getRequest, postRequest, putRequest, removeRequest } = apiOperations;
export default apiOperations;
