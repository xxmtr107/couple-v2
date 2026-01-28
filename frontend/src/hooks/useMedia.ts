import { useState, useEffect, useCallback } from 'react';
import { Media, MediaType } from '../types';
import { mediaService } from '../services/mediaService';

export function useMedia(initialFilter: MediaType | 'ALL' = 'ALL') {
    const [media, setMedia] = useState<Media[]>([]);
    const [filter, setFilter] = useState<MediaType | 'ALL'>(initialFilter);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadMedia = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const type = filter === 'ALL' ? undefined : filter;
            const data = await mediaService.getAll(type);
            setMedia(data);
        } catch {
            setError('Không thể tải kỷ niệm 😢');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        loadMedia();
    }, [loadMedia]);

    const deleteMedia = useCallback(async (id: number) => {
        try {
            await mediaService.delete(id);
            setMedia((prev) => prev.filter((m) => m.id !== id));
        } catch {
            setError('Không thể xóa 😢');
        }
    }, []);

    const downloadMedia = useCallback((id: number) => {
        window.location.href = mediaService.getDownloadUrl(id);
    }, []);

    return {
        media,
        filter,
        setFilter,
        loading,
        error,
        deleteMedia,
        downloadMedia,
        refresh: loadMedia,
    };
}
