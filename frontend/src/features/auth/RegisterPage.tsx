import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout, Button, Input } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../config/i18n';
import styles from './RegisterPage.module.css';

const RegisterPage: React.FC = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState('');
    const { register, loading, error, setError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp 😢');
            return;
        }

        if (password.length < 4) {
            setError('Mật khẩu phải ít nhất 4 ký tự nhé 💔');
            return;
        }

        const ok = await register(username, password);
        if (ok) {
            setSuccess('Đăng ký thành công! 🎉 Đang chuyển trang...');
            setTimeout(() => navigate('/login'), 1500);
        }
    };

    return (
        <AuthLayout
            title="Tạo tài khoản mới 💑"
            subtitle="Bắt đầu lưu giữ kỷ niệm của hai bạn"
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}

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

                <Input
                    placeholder={t('confirmPassword')}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon="🔐"
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    loading={loading}
                    className={styles.submitBtn}
                >
                    {t('register')} 💕
                </Button>

                <p className={styles.link}>
                    {t('hasAccount')} {' '}
                    <Link to="/login" className={styles.linkText}>
                        {t('login')}
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default RegisterPage;
