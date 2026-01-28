import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout, Button, Input } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <AuthLayout
            title="Chào mừng trở lại! 💕"
            subtitle="Đăng nhập để xem kỷ niệm của hai bạn"
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <p className={styles.error}>{error}</p>}

                <Input
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    icon="👤"
                />

                <Input
                    placeholder="Mật khẩu"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon="🔒"
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    loading={loading}
                    className={styles.submitBtn}
                >
                    Đăng nhập 💖
                </Button>

                <p className={styles.link}>
                    Chưa có tài khoản? {' '}
                    <Link to="/register" className={styles.linkText}>
                        Đăng ký ngay
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
