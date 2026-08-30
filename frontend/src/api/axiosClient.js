// src/api/axiosClient.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.yourdomain.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Auth Token
api.interceptors.request.use(
    (config) => {
        // Read token from localStorage or cookie
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 (Unauthorized) / Token Expiry
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Optional: Clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;