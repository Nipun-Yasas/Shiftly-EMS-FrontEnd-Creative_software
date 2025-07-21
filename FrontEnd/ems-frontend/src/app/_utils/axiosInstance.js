import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false, // Set to false for CORS
})

axiosInstance.interceptors.request.use(
    (config) => {
        // Don't add Authorization header for login and register requests
        const isAuthRequest = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
        
        if (!isAuthRequest) {
            const accessToken = localStorage.getItem('token');
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        }
        
        console.log('Request config:', {
            url: config.baseURL + config.url,
            method: config.method,
            headers: config.headers,
            data: config.data
        });
        
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
            if (error.response.status === 401){
                window.location.href = '/login';
            }
            else if(error.response.status === 500){
                console.error("Server Error.Please try again later.");
            }
            else if(error.code === "ECONNABORTED"){
                console.error("Request Timeout. Please try again.");
            }
            return Promise.reject(error)
        }
    }
);

export default axiosInstance;