import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Always include credentials
    config.withCredentials = true;
    
    // Ensure cookies are sent with every request
    config.headers = {
      ...config.headers,
      'X-Requested-With': 'XMLHttpRequest',
    };
    
    return config;zz
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        // Clear any local user state
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('unauthorized', {
            detail: { message: 'Session expired or invalid' }
          }));
        }
        return Promise.reject(new Error(data?.message || 'Please log in to continue'));
      } else if (status === 403) {
        return Promise.reject(new Error(data?.message || 'You do not have permission to perform this action'));
      } else if (status === 400) {
        return Promise.reject(new Error(data?.message || data || 'Invalid request'));
      } else if (status === 500) {
        return Promise.reject(new Error(data?.message || 'Server error. Please try again later.'));
      }
    } else if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    } else {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;