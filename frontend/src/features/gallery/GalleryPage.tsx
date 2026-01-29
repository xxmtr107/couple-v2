import React from 'react';
import { PageLayout, FilterChips } from '../../components';
import { MediaTimeline } from '../../components/media/MediaTimeline';
import { useMedia } from '../../hooks/useMedia';
import styles from './GalleryPage.module.css';

const GalleryPage: React.FC = () => {
    const { media, filter, setFilter, caption, setCaption, tag, setTag, date, setDate, deleteMedia, downloadMedia, loading } = useMedia();

    return (
        <PageLayout>
            <div className={styles.container}>
                <div className={styles.intro}>
                    <h2 className={styles.title}>Kỷ niệm của chúng mình ✨</h2>
                    <p className={styles.subtitle}>
                        Mỗi bức ảnh là một câu chuyện, mỗi khoảnh khắc là một kỷ niệm đẹp 💕
                    </p>
                </div>

                <FilterChips value={filter} onChange={setFilter} />

                <div style={{ display: 'flex', gap: 12, margin: '18px 0 24px 0', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Tìm caption..."
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        style={{ padding: 8, borderRadius: 8, border: '1px solid #ffd6e0', minWidth: 120 }}
                    />
                    <input
                        type="text"
                        placeholder="Tìm tag..."
                        value={tag}
                        onChange={e => setTag(e.target.value)}
                        style={{ padding: 8, borderRadius: 8, border: '1px solid #ffd6e0', minWidth: 120 }}
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        style={{ padding: 8, borderRadius: 8, border: '1px solid #ffd6e0', minWidth: 120 }}
                    />
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <span className={styles.loadingIcon}>💝</span>
                        <p>Đang tải kỷ niệm...</p>
                    </div>
                ) : (
                    <MediaTimeline
                        media={media}
                        onDownload={downloadMedia}
                        onDelete={deleteMedia}
                    />
                )}
            </div>
        </PageLayout>
    );
};

export default GalleryPage;
