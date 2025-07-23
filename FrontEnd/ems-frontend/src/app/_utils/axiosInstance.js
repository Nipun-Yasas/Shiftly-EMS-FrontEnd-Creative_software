import axios from "axios";

const BASE_URL = "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't log expected errors for specific endpoints
    const isLoginEndpoint = error.config?.url?.includes('/auth/login');
    const isRegisterEndpoint = error.config?.url?.includes('/auth/register');
    const isEmployeeProfileEndpoint = error.config?.url?.includes('/employee/profile');
    
    const is403Error = error.response?.status === 403;
    const is409Error = error.response?.status === 409;
    const is404Error = error.response?.status === 404;
    
    const isExpected403 = isLoginEndpoint && is403Error;
    const isExpected409 = isRegisterEndpoint && is409Error;
    const isExpected404 = isEmployeeProfileEndpoint && is404Error;
    
    // Only log unexpected errors
    if (!isExpected403 && !isExpected409 && !isExpected404) {
      if (error.response?.status === 404) {
        console.warn(`404 Not Found: ${error.config?.url}`);
      } else {
        console.error("Response error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          headers: error.response?.headers,
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;