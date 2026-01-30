import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../config/i18n';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Footer Links */}
                <div className={styles.links}>
                    <Link to="/settings" className={styles.link}>{t('settings')}</Link>
                    <Link to="/couple" className={styles.link}>{t('couple')}</Link>
                    <Link to="/profile" className={styles.link}>{t('profile')}</Link>
                </div>

                {/* Heart Icon */}
                <div className={styles.heartSection}>
                    <span className={styles.heart}>💕</span>
                </div>

                {/* Copyright */}
                <p className={styles.copyright}>
                    {t('madeWithLove')}
                </p>
                <p className={styles.brand}>
                    © {currentYear} HEARTLINK. {t('allRightsReserved')}
                </p>
            </div>
        </footer>
    );
};
