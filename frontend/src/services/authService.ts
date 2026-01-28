import api from './api';
import { STORAGE_KEYS } from '../config/constants';

interface LoginResponse {
    token?: string;
    accessToken?: string;
    access_token?: string;
}

export const authService = {
    async login(username: string, password: string): Promise<string> {
        const response = await api.post<LoginResponse>('/auth/login', { username, password });
        console.log('Full response:', response);
        console.log('Response data:', response.data);
        const data = response.data;
        // Handle different token field names from backend
        const token = data.token || data.accessToken || data.access_token;
        console.log('Extracted token:', token);
        if (!token) {
            console.error('Login response:', data);
            throw new Error('Token not found in response');
        }
        return token;
    },

    async register(username: string, password: string): Promise<void> {
        await api.post('/auth/register', { username, password });
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
