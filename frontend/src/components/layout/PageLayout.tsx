import React from 'react';
import { Header } from './Header';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    showHeader = true
}) => {
    return (
        <div className={styles.page}>
            <div className={styles.floatingHearts}>
                {[...Array(6)].map((_, i) => (
                    <span key={i} className={styles.floatingHeart} style={{ '--delay': `${i * 0.5}s` } as React.CSSProperties}>
                        💖
                    </span>
                ))}
            </div>
            <div className={styles.container}>
                {showHeader && <Header />}
                <main className={styles.main}>{children}</main>
            </div>
        </div>
    );
};
