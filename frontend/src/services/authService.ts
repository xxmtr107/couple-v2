import api from './api';
import { STORAGE_KEYS } from '../config/constants';

// API Response wrapper format
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

interface AuthData {
    token: string;
    username: string;
    role: string;
}

export const authService = {
    async login(username: string, password: string): Promise<string> {
        const response = await api.post<ApiResponse<AuthData>>('/auth/login', { username, password });
        console.log('Full response:', response);
        console.log('Response data:', response.data);

        if (!response.data.success) {
            throw new Error(response.data.message || 'Login failed');
        }

        const token = response.data.data?.token;
        console.log('Extracted token:', token);
        if (!token) {
            console.error('Login response:', response.data);
            throw new Error('Token not found in response');
        }
        return token;
    },

    async register(username: string, password: string): Promise<AuthData> {
        const response = await api.post<ApiResponse<AuthData>>('/auth/register', { username, password });

        if (!response.data.success) {
            throw new Error(response.data.message || 'Registration failed');
        }

        return response.data.data;
    },

    logout(): void {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        window.location.href = '/login';
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    setToken(token: string): void {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    },
};
