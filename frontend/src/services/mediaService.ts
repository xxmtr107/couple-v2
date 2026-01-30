import api from './api';
import { Media, MediaType } from '../types';
import { API_BASE_URL, UPLOADS_URL } from '../config/constants';

// API Response wrapper format (giống auth)
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

// Paginated response
interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export const mediaService = {
    // GET /paginated?page=X&size=Y&type= - Phân trang media
    async getPaginated(page = 0, size = 20, type?: MediaType): Promise<{ media: Media[]; totalPages: number; totalElements: number }> {
        const params: Record<string, string | number> = { page, size };
        if (type) params.type = type;

        const response = await api.get<ApiResponse<PaginatedResponse<Media>> | PaginatedResponse<Media>>('/media/paginated', { params });
        const data = response.data;

        let paginated: PaginatedResponse<Media>;
        if (data && 'data' in data && data.data.content) {
            paginated = data.data;
        } else {
            paginated = data as PaginatedResponse<Media>;
        }

        return {
            media: paginated.content.map((m) => ({
                ...m,
                downloadUrl: m.downloadUrl || (m.fileName ? mediaService.getMediaUrl(m.fileName) : undefined),
            })),
            totalPages: paginated.totalPages,
            totalElements: paginated.totalElements,
        };
    },

    // Legacy: get all (dùng paginated với size lớn)
    async getAll(type?: MediaType): Promise<Media[]> {
        const params = type ? { type } : {};
        const response = await api.get<ApiResponse<Media[]> | Media[]>('/media', { params });

        // Handle cả 2 format: wrapper hoặc direct array
        const data = response.data;
        let list: Media[] = [];
        if (Array.isArray(data)) {
            list = data;
        } else if (data && 'data' in data && Array.isArray(data.data)) {
            list = data.data;
        }
        // Map downloadUrl nếu có, fallback sang getMediaUrl
        return list.map((m) => ({
            ...m,
            downloadUrl: m.downloadUrl || (m.fileName ? mediaService.getMediaUrl(m.fileName) : undefined),
        }));
    },

    // Get memories from "this day" in previous years
    async getOnThisDay(): Promise<Media[]> {
        try {
            const response = await api.get<ApiResponse<Media[]> | Media[]>('/media/on-this-day');
            const data = response.data;
            let list: Media[] = [];
            if (Array.isArray(data)) {
                list = data;
            } else if (data && 'data' in data && Array.isArray(data.data)) {
                list = data.data;
            }
            return list.map((m) => ({
                ...m,
                downloadUrl: m.downloadUrl || (m.fileName ? mediaService.getMediaUrl(m.fileName) : undefined),
            }));
        } catch {
            // If API doesn't exist yet, filter locally
            const allMedia = await mediaService.getAll();
            return mediaService.filterOnThisDay(allMedia);
        }
    },

    // Local filter for "on this day" if backend doesn't support it
    filterOnThisDay(mediaList: Media[]): Media[] {
        const today = new Date();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();
        const currentYear = today.getFullYear();

        return mediaList.filter(m => {
            const dateStr = m.mediaDate || m.createdAt;
            if (!dateStr) return false;

            const mediaDate = new Date(dateStr);
            return (
                mediaDate.getMonth() === todayMonth &&
                mediaDate.getDate() === todayDate &&
                mediaDate.getFullYear() !== currentYear // From previous years
            );
        });
    },

    async upload(formData: FormData): Promise<Media> {
        const response = await api.post<ApiResponse<Media> | Media>('/media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        const data = response.data;
        // Handle wrapper format
        if (data && 'data' in data) {
            return (data as ApiResponse<Media>).data;
        }
        return data as Media;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/media/${id}`);
    },

    getDownloadUrl(id: number): string {
        return `${API_BASE_URL}/media/${id}/download`;
    },

    getMediaUrl(fileName: string): string {
        return `${UPLOADS_URL}/${fileName}`;
    },
};
