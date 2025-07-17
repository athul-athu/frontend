import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, getApiUrl, getBaseUrl } from '../config/api';
import { Platform } from 'react-native';

// Debug flag - set to true to see network logs
const DEBUG = true;

const logDebug = (...args: any[]) => {
  if (DEBUG) {
    console.log('[Network Debug]:', ...args);
  }
};

// Log environment information
const envInfo = {
  platform: Platform.OS,
  baseUrl: getApiUrl(),
  isDev: __DEV__,
};
logDebug('Environment Info:', envInfo);

// Create axios instance with base URL and default config
export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// URL joining utility to prevent double slashes
const joinUrl = (base: string, path: string): string => {
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}/${cleanPath}`;
};

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : null,
    });
    return Promise.reject(error);
  }
);

// API response interface
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: any;
}

// API error interface
export interface ApiError {
  status: number;
  message: string;
  error?: any;
  originalError?: any;
}

// Generic API call wrapper
export const apiCall = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
  config?: any
): Promise<ApiResponse<T>> => {
  try {
    logDebug('Making API call:', {
      method,
      url,
      data,
      config,
    });

    const response = await api({
      method,
      url,
      data,
      ...config,
    });

    return response.data;
  } catch (error: any) {
    logDebug('API call failed:', error);
    throw error;
  }
};

export default api; 