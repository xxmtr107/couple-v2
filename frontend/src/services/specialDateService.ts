import api from './api';
import { SpecialDate } from '../types';

export const specialDateService = {
    async getAll(): Promise<SpecialDate[]> {
        const res = await api.get('/special-dates');
        return res.data.data || res.data;
    },

    async create(date: Omit<SpecialDate, 'id'>): Promise<SpecialDate> {
        const res = await api.post('/special-dates', date);
        return res.data.data || res.data;
    },

    async update(id: number, date: Partial<SpecialDate>): Promise<SpecialDate> {
        const res = await api.put(`/special-dates/${id}`, date);
        return res.data.data || res.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/special-dates/${id}`);
    },
};
