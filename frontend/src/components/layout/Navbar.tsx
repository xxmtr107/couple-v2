import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { coupleService } from '../../services/coupleService';
import styles from './Navbar.module.css';

interface NavbarProps {
    userAvatar?: string;
    userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ userAvatar, userName }) => {
    const location = useLocation();
    const [daysTogether, setDaysTogether] = useState<number | null>(null);

    useEffect(() => {
        coupleService.getMyCouple()
            .then(couple => {
                if (couple && couple.createdAt) {
                    // Dùng daysTogether từ API nếu có
                    const days = (couple as any).daysTogether ?? coupleService.getDaysTogether(couple.createdAt);
                    setDaysTogether(days);
                }
            })
            .catch(() => { });
    }, []);

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo */}
                <Link to="/" className={styles.logo}>
                    <span className={styles.heartIcon}>💕</span>
                    <span className={styles.brandName}>HeartLink</span>
                </Link>

                {/* Days Together Badge */}
                {daysTogether !== null && (
                    <div className={styles.daysBadge}>
                        <span className={styles.daysNumber}>{daysTogether}</span>
                        <span className={styles.daysLabel}>days together</span>
                    </div>
                )}

                {/* Navigation Links */}
                <div className={styles.navLinks}>
                    <Link
                        to="/"
                        className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                    >
                        Our Story
                    </Link>
                    <Link
                        to="/timeline"
                        className={`${styles.navLink} ${isActive('/timeline') ? styles.active : ''}`}
                    >
                        Timeline
                    </Link>
                    <Link
                        to="/couple"
                        className={`${styles.navLink} ${isActive('/couple') ? styles.active : ''}`}
                    >
                        Couple
                    </Link>
                </div>

                {/* Right Side - User Menu */}
                <div className={styles.rightMenu}>
                    <Link to="/profile" className={styles.profileLink}>
                        <div className={styles.avatar}>
                            {userAvatar ? (
                                <img src={userAvatar} alt={userName} className={styles.avatarImg} />
                            ) : (
                                <span className={styles.avatarPlaceholder}>👤</span>
                            )}
                        </div>
                    </Link>
                    <button
                        className={styles.signOutBtn}
                        onClick={() => authService.logout()}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
};
