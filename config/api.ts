import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get the appropriate base URL based on the environment
export const getBaseUrl = () => {
  return 'http://192.168.1.36:8000/';
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  API_VERSION: '/api/v1',
  TIMEOUT: 10000, // 10 seconds
};

// Get the complete API URL
export const getApiUrl = () => {
  const baseUrl = API_CONFIG.BASE_URL;
  // Ensure there's a trailing slash on the base URL
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
};

// API Endpoints - include trailing slashes to match backend
export const API_ENDPOINTS = {
  LOGIN: 'login/',
  SIGNUP: 'create_user/',  // Using create_user endpoint
  REGISTER: 'register/',
  USER_PROFILE: 'user/profile/',
  UPDATE_PROFILE: 'user/update/',
  // Add more endpoints as needed
}; 