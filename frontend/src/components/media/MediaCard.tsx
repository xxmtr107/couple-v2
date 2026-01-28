import React from 'react';
import { Media } from '../../types';
import { mediaService } from '../../services/mediaService';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import styles from './MediaCard.module.css';

interface MediaCardProps {
    media: Media;
    onDownload: (id: number) => void;
    onDelete: (id: number) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
    media,
    onDownload,
    onDelete,
}) => {
    const mediaUrl = mediaService.getMediaUrl(media.fileName);

    return (
        <Card className={styles.card}>
            <div className={styles.mediaWrapper}>
                {media.type === 'PHOTO' ? (
                    <img
                        src={mediaUrl}
                        alt={media.originalName}
                        className={styles.media}
                        loading="lazy"
                    />
                ) : (
                    <video controls className={styles.media}>
                        <source src={mediaUrl} type={media.contentType} />
                    </video>
                )}
                <div className={styles.overlay}>
                    <span className={styles.type}>
                        {media.type === 'PHOTO' ? '📷' : '🎬'}
                    </span>
                </div>
            </div>

            <div className={styles.info}>
                <span className={styles.name} title={media.originalName}>
                    {media.originalName}
                </span>
                <div className={styles.actions}>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => onDownload(media.id)}
                    >
                        💾
                    </Button>
                    <Button
                        variant="danger"
                        size="small"
                        onClick={() => onDelete(media.id)}
                    >
                        🗑️
                    </Button>
                </div>
            </div>
        </Card>
    );
};
