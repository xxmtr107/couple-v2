import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const login = useCallback(async (username: string, password: string) => {
        setLoading(true);
        setError('');
        try {
            const token = await authService.login(username, password);
            authService.setToken(token);
            navigate('/');
        } catch {
            setError('Sai tài khoản hoặc mật khẩu 💔');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const register = useCallback(async (username: string, password: string) => {
        setLoading(true);
        setError('');
        try {
            await authService.register(username, password);
            return true;
        } catch {
            setError('Username đã tồn tại rồi babe 😢');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout();
    }, []);

    return { login, register, logout, loading, error, setError };
}
