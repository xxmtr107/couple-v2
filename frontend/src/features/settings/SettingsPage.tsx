import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { CoupleSettings } from '../../types';
import styles from './SettingsPage.module.css';

export const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<CoupleSettings | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        settingsService.getSettings().then(setSettings).catch(() => { });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!settings) return;
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!settings) return;
        try {
            await settingsService.updateSettings(settings);
            setMessage('Đã lưu cài đặt!');
        } catch {
            setMessage('Lưu thất bại!');
        }
    };

    if (!settings) return <div className={styles.container}>Đang tải cài đặt...</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Cài đặt giao diện & thông báo</h2>
            <label className={styles.label}>
                Theme:
                <select className={styles.select} name="theme" value={settings.theme || ''} onChange={handleChange}>
                    <option value="">Mặc định</option>
                    <option value="pink">Hồng</option>
                    <option value="blue">Xanh</option>
                    <option value="dark">Tối</option>
                </select>
            </label>
            <label className={styles.label}>
                Font:
                <select className={styles.select} name="font" value={settings.font || ''} onChange={handleChange}>
                    <option value="">Mặc định</option>
                    <option value="serif">Serif</option>
                    <option value="sans">Sans</option>
                    <option value="handwriting">Handwriting</option>
                </select>
            </label>
            <label className={styles.label}>
                Background:
                <input className={styles.input} name="background" value={settings.background || ''} onChange={handleChange} placeholder="URL hình nền hoặc màu" />
            </label>
            <label className={styles.label}>
                <input className={styles.checkbox} type="checkbox" name="notificationsEnabled" checked={!!settings.notificationsEnabled} onChange={e => setSettings({ ...settings, notificationsEnabled: e.target.checked })} />
                Bật thông báo
            </label>
            <button className={styles.button} onClick={handleSave}>Lưu</button>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};
