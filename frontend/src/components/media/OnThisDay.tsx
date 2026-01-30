import React, { useEffect, useState } from 'react';
import { Media } from '../../types';
import { mediaService } from '../../services/mediaService';
import { useTranslation, getCurrentLanguage } from '../../config/i18n';
import styles from './OnThisDay.module.css';

interface OnThisDayProps {
    onMediaClick?: (media: Media) => void;
}

export const OnThisDay: React.FC<OnThisDayProps> = ({ onMediaClick }) => {
    const { t } = useTranslation();
    const [memories, setMemories] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mediaService.getOnThisDay()
            .then(setMemories)
            .catch(() => setMemories([]))
            .finally(() => setLoading(false));
    }, []);

    // Group by year
    const groupedByYear = memories.reduce((acc, media) => {
        const dateStr = media.mediaDate || media.createdAt;
        if (!dateStr) return acc;
        const year = new Date(dateStr).getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(media);
        return acc;
    }, {} as Record<number, Media[]>);

    const years = Object.keys(groupedByYear).sort((a, b) => Number(b) - Number(a));

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <span className={styles.loadingIcon}>✨</span>
                    <p>{t('loading')}</p>
                </div>
            </div>
        );
    }

    if (memories.length === 0) {
        return null; // Don't show if no memories on this day
    }

    const today = new Date();
    const lang = getCurrentLanguage();
    const formattedDate = today.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
        day: 'numeric',
        month: 'long'
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.icon}>📅</span>
                <div className={styles.headerText}>
                    <h3 className={styles.title}>{t('onThisDay')}</h3>
                    <p className={styles.date}>{formattedDate}</p>
                </div>
            </div>

            <div className={styles.memoriesContainer}>
                {years.map(year => (
                    <div key={year} className={styles.yearSection}>
                        <span className={styles.yearBadge}>{year}</span>
                        <div className={styles.memoriesGrid}>
                            {groupedByYear[Number(year)].map(media => (
                                <div
                                    key={media.id}
                                    className={styles.memoryCard}
                                    onClick={() => onMediaClick?.(media)}
                                >
                                    {media.type === 'VIDEO' ? (
                                        <video
                                            src={media.downloadUrl}
                                            className={styles.memoryMedia}
                                            muted
                                        />
                                    ) : (
                                        <img
                                            src={media.downloadUrl}
                                            alt={media.caption || 'Memory'}
                                            className={styles.memoryMedia}
                                        />
                                    )}
                                    <div className={styles.overlay}>
                                        {media.type === 'VIDEO' && (
                                            <span className={styles.playIcon}>▶</span>
                                        )}
                                    </div>
                                    {media.caption && (
                                        <p className={styles.caption}>{media.caption}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
