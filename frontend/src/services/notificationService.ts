import api from './api';
import { Notification } from '../types';

export const notificationService = {
    async getAll(): Promise<Notification[]> {
        const res = await api.get('/notifications');
        return res.data.data || res.data;
    },

    async markRead(id: number): Promise<Notification> {
        const res = await api.post(`/notifications/${id}/read`);
        return res.data.data || res.data;
    },
};
