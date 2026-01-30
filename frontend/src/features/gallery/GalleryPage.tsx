import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components';
import { YearTimeline } from '../../components/media/YearTimeline';
import { AlbumDetail } from '../../components/media/AlbumDetail';
import { OnThisDay } from '../../components/media/OnThisDay';
import { useMedia } from '../../hooks/useMedia';
import styles from './GalleryPage.module.css';

interface SelectedAlbum {
    year: number;
    month: number;
}

const GalleryPage: React.FC = () => {
    const { media, deleteMedia, downloadMedia, loading } = useMedia();
    const [selectedAlbum, setSelectedAlbum] = useState<SelectedAlbum | null>(null);
    const navigate = useNavigate();

    // Lọc media theo tháng đã chọn
    const getMonthMedia = (year: number, month: number) => {
        return media.filter(item => {
            const date = item.mediaDate || item.createdAt || '';
            if (!date) return false;
            const d = new Date(date);
            return d.getFullYear() === year && d.getMonth() + 1 === month;
        });
    };

    const handleAlbumClick = (year: number, month: number) => {
        setSelectedAlbum({ year, month });
    };

    const handleBack = () => {
        setSelectedAlbum(null);
    };

    return (
        <PageLayout>
            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loading}>
                        <span className={styles.loadingIcon}>💝</span>
                        <p>Đang tải kỷ niệm...</p>
                    </div>
                ) : selectedAlbum ? (
                    <AlbumDetail
                        year={selectedAlbum.year}
                        month={selectedAlbum.month}
                        media={getMonthMedia(selectedAlbum.year, selectedAlbum.month)}
                        onBack={handleBack}
                        onDownload={downloadMedia}
                        onDelete={deleteMedia}
                    />
                ) : (
                    <>
                        {/* On This Day Memories */}
                        <OnThisDay />

                        <YearTimeline
                            media={media}
                            onAlbumClick={handleAlbumClick}
                        />

                        {/* Upload CTA Button */}
                        <div className={styles.uploadCta}>
                            <button
                                className={styles.uploadButton}
                                onClick={() => navigate('/upload')}
                            >
                                📸 Upload New Photos
                            </button>
                        </div>
                    </>
                )}
            </div>
        </PageLayout>
    );
};

export default GalleryPage;
