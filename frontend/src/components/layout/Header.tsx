import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../common/Button';
import { authService } from '../../services/authService';
import styles from './Header.module.css';

export const Header: React.FC = () => {
    const location = useLocation();
    const isUploadPage = location.pathname === '/upload';

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <span className={styles.heart}>💕</span>
                <h1 className={styles.title}>Our Love Story</h1>
            </div>

            <nav className={styles.nav}>
                {isUploadPage ? (
                    <Link to="/" className={styles.link}>
                        <Button variant="ghost" size="small">
                            ← Trở về Gallery
                        </Button>
                    </Link>
                ) : (
                    <Link to="/upload" className={styles.link}>
                        <Button variant="primary" size="small">
                            📷 Upload kỷ niệm
                        </Button>
                    </Link>
                )}
                <Button
                    variant="ghost"
                    size="small"
                    onClick={() => authService.logout()}
                >
                    Đăng xuất
                </Button>
            </nav>
        </header>
    );
};
