import React from 'react';
import { Media } from '../../types';
import { mediaService } from '../../services/mediaService';
import styles from './MonthAlbum.module.css';

interface MonthAlbumProps {
    month: number;
    year: number;
    media: Media[];
    onClick: () => void;
}

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const monthEmojis = ['🎆', '💝', '🌸', '🌷', '🌺', '☀️', '🌊', '🍃', '🍂', '🎃', '🍁', '✨'];

export const MonthAlbum: React.FC<MonthAlbumProps> = ({ month, year, media, onClick }) => {
    // Lấy ảnh đầu tiên làm thumbnail
    const thumbnail = media[0];
    const thumbnailUrl = thumbnail?.downloadUrl || (thumbnail?.fileName ? mediaService.getMediaUrl(thumbnail.fileName) : '');

    return (
        <div className={styles.album} onClick={onClick}>
            <div className={styles.imageWrapper}>
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={`${monthNames[month - 1]} ${year}`}
                        className={styles.thumbnail}
                        loading="lazy"
                    />
                ) : (
                    <div className={styles.placeholder}>
                        <span>{monthEmojis[month - 1]}</span>
                    </div>
                )}
                <div className={styles.badge}>
                    <span className={styles.badgeIcon}>📷</span>
                </div>
            </div>
            <div className={styles.info}>
                <h3 className={styles.monthName}>
                    {monthEmojis[month - 1]} {monthNames[month - 1]}
                </h3>
                <p className={styles.count}>{media.length} MOMENTS</p>
            </div>
        </div>
    );
};
