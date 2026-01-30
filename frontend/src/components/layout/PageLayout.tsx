import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
    children: React.ReactNode;
    showNavbar?: boolean;
    showFooter?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    showNavbar = true,
    showFooter = true
}) => {
    return (
        <div className={styles.page}>
            {/* Floating Hearts Background */}
            <div className={styles.floatingHearts}>
                {[...Array(6)].map((_, i) => (
                    <span key={i} className={styles.floatingHeart} style={{ '--delay': `${i * 0.5}s` } as React.CSSProperties}>
                        💖
                    </span>
                ))}
            </div>

            {/* Navbar */}
            {showNavbar && <Navbar />}

            {/* Main Content */}
            <main className={styles.main}>{children}</main>

            {/* Footer */}
            {showFooter && <Footer />}
        </div>
    );
};
