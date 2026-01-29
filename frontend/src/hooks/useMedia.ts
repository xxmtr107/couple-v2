import { useState, useEffect, useCallback } from 'react';
import { Media, MediaType } from '../types';
import { mediaService } from '../services/mediaService';

export function useMedia(initialFilter: MediaType | 'ALL' = 'ALL') {
    const [media, setMedia] = useState<Media[]>([]);
    const [filter, setFilter] = useState<MediaType | 'ALL'>(initialFilter);
    const [caption, setCaption] = useState('');
    const [tag, setTag] = useState('');
    const [date, setDate] = useState('');
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

    // Filter client-side
    const filteredMedia = media.filter(m => {
        if (caption && !(m.caption || '').toLowerCase().includes(caption.toLowerCase())) return false;
        if (tag && !(m.tags || []).some(t => t.toLowerCase().includes(tag.toLowerCase()))) return false;
        if (date && !(m.mediaDate || m.createdAt || '').startsWith(date)) return false;
        return true;
    });

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
        media: filteredMedia,
        filter,
        setFilter,
        caption,
        setCaption,
        tag,
        setTag,
        date,
        setDate,
        loading,
        error,
        deleteMedia,
        downloadMedia,
        refresh: loadMedia,
    };
}
