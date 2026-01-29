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

export const mediaService = {
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
