import axios from 'axios';
import { BASE_URL } from './apiPaths';

// Helper function to check if token is expired
const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch (e) {
        return true;
    }
};

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false, 
})

axiosInstance.interceptors.request.use(
    (config) => {
        // Don't add Authorization header for login and register requests
        const isAuthRequest = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
        
        if (!isAuthRequest) {
            const accessToken = localStorage.getItem('token');
            if (accessToken) {
                // Check if token is expired before making request
                if (isTokenExpired(accessToken)) {
                    console.error('Token expired! Clearing storage and redirecting to login.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                    return Promise.reject(new Error('Token expired'));
                }
                
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            } else {
                console.warn('Debug - No token found for protected route:', config.url);
            }
        }
        
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response){
            console.error('Response error details:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                url: error.config?.url,
                headers: error.response.headers
            });
            
            if (error.response.status === 401){
                console.warn('401 Unauthorized - redirecting to login');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
            }
            else if (error.response.status === 403){
                console.error('403 Forbidden - Access denied. Check user permissions and token validity.');
            }
            else if(error.response.status === 500){
                console.error("Server Error.Please try again later.");
            }
            else if(error.code === "ECONNABORTED"){
                console.error("Request Timeout. Please try again.");
            }
            return Promise.reject(error)
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;