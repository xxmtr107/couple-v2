import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout, Button, Input } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../config/i18n';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
    const { t } = useTranslation();
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
                    placeholder={t('username')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    icon="👤"
                />

                <Input
                    placeholder={t('password')}
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
                    {t('login')} 💖
                </Button>

                <p className={styles.link}>
                    {t('noAccount')} {' '}
                    <Link to="/register" className={styles.linkText}>
                        {t('register')}
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
