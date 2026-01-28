import React from 'react';
import { Card } from '../common/Card';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle,
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.decoration}>
                {[...Array(8)].map((_, i) => (
                    <span
                        key={i}
                        className={styles.heart}
                        style={{
                            '--delay': `${i * 0.3}s`,
                            '--x': `${Math.random() * 100}%`,
                        } as React.CSSProperties}
                    >
                        💕
                    </span>
                ))}
            </div>

            <Card className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.emoji}>💑</span>
                    <h1 className={styles.title}>{title}</h1>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
                {children}
            </Card>
        </div>
    );
};
