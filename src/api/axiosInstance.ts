import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://admin-moderator-backend-staging.up.railway.app/api';

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Request Interceptor: Attach the token if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('preproute_auth_token');
    if (token) {
      // Set both standard Authorization and custom x-auth-token for safety
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error('API Error Response:', error.response || error.message);
    
    // Auto logout on 401 Unauthorized if token exists
    if (error.response?.status === 401) {
      const token = localStorage.getItem('preproute_auth_token');
      if (token) {
        console.warn('Session expired, clearing authentication details.');
        localStorage.removeItem('preproute_auth_token');
        localStorage.removeItem('preproute_auth_user');
        // Let state stores handle the logout redirect if needed
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
