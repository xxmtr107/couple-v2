import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout, Button, Input } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import styles from './RegisterPage.module.css';

const RegisterPage: React.FC = () => {
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

                <Input
                    placeholder="Xác nhận mật khẩu"
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
                    Đăng ký 💕
                </Button>

                <p className={styles.link}>
                    Đã có tài khoản? {' '}
                    <Link to="/login" className={styles.linkText}>
                        Đăng nhập ngay
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default RegisterPage;
