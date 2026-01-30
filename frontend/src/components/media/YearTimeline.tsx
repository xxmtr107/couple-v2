import React from 'react';
import { Media } from '../../types';
import { MonthAlbum } from './MonthAlbum';
import styles from './YearTimeline.module.css';

interface YearTimelineProps {
    media: Media[];
    onAlbumClick: (year: number, month: number) => void;
    coupleInfo?: {
        name1?: string;
        name2?: string;
        startDate?: string;
    };
}

function groupByYearMonth(media: Media[]) {
    const groups: { [key: string]: Media[] } = {};

    media.forEach(item => {
        const date = item.mediaDate || item.createdAt || '';
        if (!date) return;

        const d = new Date(date);
        if (isNaN(d.getTime())) return;

        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const key = `${year}-${month.toString().padStart(2, '0')}`;

        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    });

    return groups;
}

function getDaysTogether(startDate?: string): number {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export const YearTimeline: React.FC<YearTimelineProps> = ({ media, onAlbumClick, coupleInfo }) => {
    const groups = groupByYearMonth(media);
    const sortedKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    // Group by year
    const yearGroups: { [year: string]: { month: number; media: Media[] }[] } = {};
    sortedKeys.forEach(key => {
        const [year, month] = key.split('-');
        if (!yearGroups[year]) yearGroups[year] = [];
        yearGroups[year].push({ month: parseInt(month), media: groups[key] });
    });

    const years = Object.keys(yearGroups).sort((a, b) => parseInt(b) - parseInt(a));
    const daysTogether = getDaysTogether(coupleInfo?.startDate);
    const totalMoments = media.length;

    return (
        <div className={styles.container}>
            {/* Header với avatar couple */}
            <div className={styles.header}>
                <div className={styles.avatarGroup}>
                    <div className={styles.avatar}>👩</div>
                    <div className={styles.heartBadge}>💕</div>
                    <div className={styles.avatar}>👨</div>
                </div>
                <h1 className={styles.title}>Our Year Together</h1>
                <p className={styles.subtitle}>
                    ✨ {daysTogether > 0 ? `${daysTogether} Days` : `${totalMoments} Moments`} of Love & Memories ✨
                </p>
                {coupleInfo?.startDate && (
                    <p className={styles.startDate}>
                        Since {new Date(coupleInfo.startDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </p>
                )}
            </div>

            {/* Albums Grid theo năm */}
            {years.map(year => (
                <div key={year} className={styles.yearSection}>
                    {years.length > 1 && (
                        <h2 className={styles.yearTitle}>
                            💖 {year}
                        </h2>
                    )}
                    <div className={styles.albumGrid}>
                        {yearGroups[year]
                            .sort((a, b) => a.month - b.month)
                            .map(({ month, media: monthMedia }) => (
                                <MonthAlbum
                                    key={`${year}-${month}`}
                                    year={parseInt(year)}
                                    month={month}
                                    media={monthMedia}
                                    onClick={() => onAlbumClick(parseInt(year), month)}
                                />
                            ))}
                    </div>
                </div>
            ))}

            {/* Empty state */}
            {media.length === 0 && (
                <div className={styles.empty}>
                    <span className={styles.emptyIcon}>💝</span>
                    <h3>Chưa có kỷ niệm nào</h3>
                    <p>Hãy upload những khoảnh khắc đẹp của hai bạn nhé!</p>
                </div>
            )}

            {/* Footer CTA */}
            <div className={styles.footer}>
                <h3 className={styles.footerTitle}>Add More Memories</h3>
                <p className={styles.footerText}>
                    Every moment with you is a treasure waiting to be archived. 💕
                </p>
            </div>
        </div>
    );
};
