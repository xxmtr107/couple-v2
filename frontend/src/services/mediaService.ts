import api from './api';
import { Media, MediaType } from '../types';
import { API_BASE_URL, UPLOADS_URL } from '../config/constants';

export const mediaService = {
    async getAll(type?: MediaType): Promise<Media[]> {
        const params = type ? { type } : {};
        const response = await api.get<Media[]>('/media', { params });
        return response.data;
    },

    async upload(file: File): Promise<Media> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<Media>('/media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
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
