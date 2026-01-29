import api from './api';
import { CoupleSettings } from '../types';

export const settingsService = {
    async getSettings(): Promise<CoupleSettings> {
        const res = await api.get('/settings');
        return res.data.data || res.data;
    },

    async updateSettings(settings: Partial<CoupleSettings>): Promise<CoupleSettings> {
        const res = await api.put('/settings', settings);
        return res.data.data || res.data;
    },
};
