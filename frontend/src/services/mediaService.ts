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
        if (Array.isArray(data)) {
            return data;
        }
        // Nếu là wrapper format
        if (data && 'data' in data && Array.isArray(data.data)) {
            return data.data;
        }
        return [];
    },

    async upload(file: File): Promise<Media> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<ApiResponse<Media> | Media>('/media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        const data = response.data;
        // Handle wrapper format
        if (data && 'data' in data && !('id' in data)) {
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
