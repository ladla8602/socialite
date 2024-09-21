import { AxiosError, AxiosRequestConfig } from 'axios';

// Generic API response type
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: AxiosRequestConfig;
}

// Custom API error type
// export interface ApiError extends AxiosError {
//   response?: ApiResponse;
// }

export type CustomErrorHandler = (error: AxiosError) => never;

// API operations type definitions
export interface ApiOperations {
  getRequest: <T = unknown>(url: string, params?: Record<string, unknown>) => Promise<T>;
  postRequest: <T = unknown>(
    url: string,
    body?: unknown,
    params?: Record<string, unknown>,
    headers?: Record<string, string>,
  ) => Promise<T>;
  putRequest: <T = unknown>(url: string, body?: unknown) => Promise<T>;
  removeRequest: <T = unknown>(url: string, body?: unknown, headers?: Record<string, string>) => Promise<T>;
}

// Component props type (if needed in the future)
export interface ComponentProps {
  children: React.ReactNode;
}
