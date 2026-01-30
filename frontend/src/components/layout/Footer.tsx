import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Footer Links */}
                <div className={styles.links}>
                    <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
                    <Link to="/terms" className={styles.link}>Terms of Service</Link>
                    <Link to="/about" className={styles.link}>Our Archive</Link>
                    <Link to="/contact" className={styles.link}>Contact Us</Link>
                </div>

                {/* Heart Icon */}
                <div className={styles.heartSection}>
                    <span className={styles.heart}>💕</span>
                </div>

                {/* Copyright */}
                <p className={styles.copyright}>
                    Captured with love, 2023-{currentYear}
                </p>
                <p className={styles.brand}>
                    © {currentYear} HEARTLINK MEMORIES. ALL RIGHTS RESERVED.
                </p>
            </div>
        </footer>
    );
};
