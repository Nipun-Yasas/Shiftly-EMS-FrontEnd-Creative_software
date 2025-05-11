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

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        console.warn('Unauthorized: Please log in.');
        window.dispatchEvent(new Event('unauthorized'));
        return Promise.reject(new Error('Please log in to continue'));
      } else if (status === 403) {
        console.warn('Forbidden: Insufficient permissions.');
        return Promise.reject(new Error('You do not have permission to perform this action'));
      } else if (status === 400) {
        console.warn('Bad Request:', data);
        return Promise.reject(new Error(data || 'Invalid request'));
      } else if (status === 500) {
        console.error('Server Error:', data);
        return Promise.reject(new Error('Server error. Please try again later.'));
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request Timeout');
      return Promise.reject(new Error('Request timed out. Please try again.'));
    } else {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
  }
);

export default axiosInstance;