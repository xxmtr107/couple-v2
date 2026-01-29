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
    const mediaUrl = media.downloadUrl || mediaService.getMediaUrl(media.fileName);

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
                {media.caption && (
                    <div className={styles.caption} title={media.caption}>
                        <b>Caption:</b> {media.caption}
                    </div>
                )}
                {media.tags && media.tags.length > 0 && (
                    <div className={styles.tags} title={media.tags.join(', ')}>
                        <b>Tag:</b> {media.tags.join(', ')}
                    </div>
                )}
                {(media.mediaDate || media.createdAt) && (
                    <div className={styles.date}>
                        <b>Ngày:</b> {media.mediaDate ? media.mediaDate : (media.createdAt ? media.createdAt.slice(0, 10) : '')}
                    </div>
                )}
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
