import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { coupleService } from '../../services/coupleService';
import { CoupleSettings } from '../../types';
import styles from './SettingsPage.module.css';

export const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<CoupleSettings | null>(null);
    const [message, setMessage] = useState('');
    const [hasCouple, setHasCouple] = useState(false);
    const [showBreakupConfirm, setShowBreakupConfirm] = useState(false);
    const [breakupLoading, setBreakupLoading] = useState(false);

    useEffect(() => {
        settingsService.getSettings().then(setSettings).catch(() => { });
        coupleService.getMyCouple().then(couple => {
            setHasCouple(!!couple);
        }).catch(() => { });
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

    const handleBreakup = async () => {
        setBreakupLoading(true);
        try {
            await coupleService.breakup();
            setMessage('Đã hủy kết nối thành công.');
            setHasCouple(false);
            setShowBreakupConfirm(false);
            // Redirect to couple page after breakup
            window.location.href = '/couple';
        } catch {
            setMessage('Hủy kết nối thất bại. Vui lòng thử lại.');
        } finally {
            setBreakupLoading(false);
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

            {/* Danger Zone - Breakup */}
            {hasCouple && (
                <div className={styles.dangerZone}>
                    <h3 className={styles.dangerTitle}>⚠️ Vùng nguy hiểm</h3>
                    <p className={styles.dangerDesc}>
                        Hủy kết nối sẽ xóa toàn bộ dữ liệu chung. Hành động này không thể hoàn tác.
                    </p>

                    {!showBreakupConfirm ? (
                        <button
                            className={styles.breakupBtn}
                            onClick={() => setShowBreakupConfirm(true)}
                        >
                            💔 Hủy kết nối
                        </button>
                    ) : (
                        <div className={styles.confirmBox}>
                            <p className={styles.confirmText}>
                                Bạn có chắc chắn muốn hủy kết nối?
                            </p>
                            <div className={styles.confirmActions}>
                                <button
                                    className={styles.confirmYes}
                                    onClick={handleBreakup}
                                    disabled={breakupLoading}
                                >
                                    {breakupLoading ? 'Đang xử lý...' : 'Xác nhận hủy'}
                                </button>
                                <button
                                    className={styles.confirmNo}
                                    onClick={() => setShowBreakupConfirm(false)}
                                    disabled={breakupLoading}
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
