import api from './api';
import { Couple, CoupleRequest, User } from '../types';

export const coupleService = {
    async getCouple(): Promise<Couple> {
        const res = await api.get('/couple');
        return res.data.data || res.data;
    },

    async sendRequest(toUsername: string): Promise<CoupleRequest> {
        const res = await api.post('/couple/request', { toUsername });
        return res.data.data || res.data;
    },

    async getRequests(): Promise<CoupleRequest[]> {
        const res = await api.get('/couple/requests');
        return res.data.data || res.data;
    },

    async respondRequest(requestId: number, accept: boolean): Promise<CoupleRequest> {
        const res = await api.post(`/couple/request/${requestId}/respond`, { accept });
        return res.data.data || res.data;
    },
};
