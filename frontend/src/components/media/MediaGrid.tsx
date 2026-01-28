import React from 'react';
import { Media } from '../../types';
import { MediaCard } from './MediaCard';
import styles from './MediaGrid.module.css';

interface MediaGridProps {
    media: Media[];
    onDownload: (id: number) => void;
    onDelete: (id: number) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
    media,
    onDownload,
    onDelete,
}) => {
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
    );
};
