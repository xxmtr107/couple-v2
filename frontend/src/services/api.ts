import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../config/constants';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
