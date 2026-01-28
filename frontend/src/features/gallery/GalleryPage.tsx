import React from 'react';
import { PageLayout, FilterChips, MediaGrid } from '../../components';
import { useMedia } from '../../hooks/useMedia';
import styles from './GalleryPage.module.css';

const GalleryPage: React.FC = () => {
    const { media, filter, setFilter, deleteMedia, downloadMedia, loading } = useMedia();

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

                {loading ? (
                    <div className={styles.loading}>
                        <span className={styles.loadingIcon}>💝</span>
                        <p>Đang tải kỷ niệm...</p>
                    </div>
                ) : (
                    <MediaGrid
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
