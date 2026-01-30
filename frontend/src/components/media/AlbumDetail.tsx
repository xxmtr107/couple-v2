import React from 'react';
import { Media } from '../../types';
import { MediaCard } from './MediaCard';
import styles from './AlbumDetail.module.css';

interface AlbumDetailProps {
    year: number;
    month: number;
    media: Media[];
    onBack: () => void;
    onDownload: (id: number) => void;
    onDelete: (id: number) => void;
}

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const monthEmojis = ['🎆', '💝', '🌸', '🌷', '🌺', '☀️', '🌊', '🍃', '🍂', '🎃', '🍁', '✨'];

export const AlbumDetail: React.FC<AlbumDetailProps> = ({
    year,
    month,
    media,
    onBack,
    onDownload,
    onDelete,
}) => {
    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button className={styles.backButton} onClick={onBack}>
                    ← Back to Albums
                </button>
                <div className={styles.titleSection}>
                    <span className={styles.emoji}>{monthEmojis[month - 1]}</span>
                    <h1 className={styles.title}>
                        {monthNames[month - 1]} {year}
                    </h1>
                    <p className={styles.count}>{media.length} beautiful moments 💕</p>
                </div>
            </div>

            {/* Media Grid */}
            <div className={styles.grid}>
                {media.map((item) => (
                    <MediaCard
                        key={item.id}
                        media={item}
                        onDownload={onDownload}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {media.length === 0 && (
                <div className={styles.empty}>
                    <span>😢</span>
                    <p>No moments in this month yet</p>
                </div>
            )}
        </div>
    );
};
