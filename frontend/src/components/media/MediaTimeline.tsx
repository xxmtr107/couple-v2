import React from 'react';
import { Media } from '../../types';
import { MediaGrid } from './MediaGrid';
import styles from './MediaGrid.module.css';

function groupByMonthYear(media: Media[]) {
    const groups: { [key: string]: Media[] } = {};
    media.forEach(item => {
        const date = item.mediaDate || item.createdAt || '';
        if (!date) return;
        const d = new Date(date);
        const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    });
    return groups;
}

interface MediaTimelineProps {
    media: Media[];
    onDownload: (id: number) => void;
    onDelete: (id: number) => void;
}

export const MediaTimeline: React.FC<MediaTimelineProps> = ({ media, onDownload, onDelete }) => {
    const groups = groupByMonthYear(media);
    const sortedKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    if (media.length === 0) {
        return (
            <div className={styles.empty}>
                <span className={styles.emptyIcon}>💝</span>
                <h3 className={styles.emptyTitle}>Chưa có kỷ niệm nào</h3>
                <p className={styles.emptyText}>Hãy upload những khoảnh khắc đẹp của hai bạn nhé!</p>
            </div>
        );
    }

    return (
        <div>
            {sortedKeys.map(key => {
                const [year, month] = key.split('-');
                return (
                    <div key={key} className={styles.timelineGroup}>
                        <h2 className={styles.timelineMonth}>
                            Tháng {month}/{year}
                        </h2>
                        <MediaGrid media={groups[key]} onDownload={onDownload} onDelete={onDelete} />
                    </div>
                );
            })}
        </div>
    );
};
