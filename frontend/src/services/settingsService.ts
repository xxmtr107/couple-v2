import { CoupleSettings } from '../types';

const SETTINGS_KEY = 'couple_settings';

// Default settings
const defaultSettings: CoupleSettings = {
    theme: '',
    font: '',
    background: '',
    notificationsEnabled: true,
};

export const settingsService = {
    async getSettings(): Promise<CoupleSettings> {
        // Use localStorage since backend doesn't have settings API
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            try {
                return { ...defaultSettings, ...JSON.parse(saved) };
            } catch {
                return defaultSettings;
            }
        }
        return defaultSettings;
    },

    async updateSettings(settings: Partial<CoupleSettings>): Promise<CoupleSettings> {
        // Save to localStorage
        const current = await this.getSettings();
        const updated = { ...current, ...settings };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        return updated;
    },
};
