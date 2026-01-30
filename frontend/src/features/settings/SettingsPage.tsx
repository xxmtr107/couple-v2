import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { coupleService } from '../../services/coupleService';
import { CoupleSettings } from '../../types';
import { useTranslation, Language } from '../../config/i18n';
import styles from './SettingsPage.module.css';

export const SettingsPage: React.FC = () => {
    const { t, lang, setLang } = useTranslation();
    const [settings, setSettings] = useState<CoupleSettings>({
        theme: '',
        font: '',
        background: '',
        notificationsEnabled: true,
    });
    const [message, setMessage] = useState('');
    const [hasCouple, setHasCouple] = useState(false);
    const [showBreakupConfirm, setShowBreakupConfirm] = useState(false);
    const [breakupLoading, setBreakupLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        settingsService.getSettings()
            .then(setSettings)
            .catch(() => { })
            .finally(() => setLoading(false));
        coupleService.getMyCouple().then(couple => {
            setHasCouple(!!couple && !!couple.id);
        }).catch(() => { });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleLanguageChange = (newLang: Language) => {
        setLang(newLang);
    };

    const handleSave = async () => {
        try {
            await settingsService.updateSettings(settings);
            setMessage(t('saved'));
            setTimeout(() => setMessage(''), 2000);
        } catch {
            setMessage(t('saveFailed'));
        }
    };

    const handleBreakup = async () => {
        setBreakupLoading(true);
        try {
            await coupleService.breakup();
            setMessage(t('requestRejected'));
            setHasCouple(false);
            setShowBreakupConfirm(false);
            // Redirect to couple page after breakup
            window.location.href = '/couple';
        } catch {
            setMessage(t('saveFailed'));
        } finally {
            setBreakupLoading(false);
        }
    };

    if (loading) return <div className={styles.container}>{t('loading')}</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{t('settingsTitle')}</h2>

            {/* Language Selector */}
            <div className={styles.settingRow}>
                <label className={styles.label}>
                    🌐 {t('language')}:
                </label>
                <div className={styles.langToggle}>
                    <button
                        className={`${styles.langBtn} ${lang === 'vi' ? styles.langActive : ''}`}
                        onClick={() => handleLanguageChange('vi')}
                    >
                        🇻🇳 Tiếng Việt
                    </button>
                    <button
                        className={`${styles.langBtn} ${lang === 'en' ? styles.langActive : ''}`}
                        onClick={() => handleLanguageChange('en')}
                    >
                        🇬🇧 English
                    </button>
                </div>
            </div>

            <label className={styles.label}>
                {t('theme')}:
                <select className={styles.select} name="theme" value={settings.theme || ''} onChange={handleChange}>
                    <option value="">{t('themeDefault')}</option>
                    <option value="pink">{t('themePink')}</option>
                    <option value="blue">{t('themeBlue')}</option>
                    <option value="dark">{t('themeDark')}</option>
                </select>
            </label>
            <label className={styles.label}>
                Font:
                <select className={styles.select} name="font" value={settings.font || ''} onChange={handleChange}>
                    <option value="">{t('themeDefault')}</option>
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
                {t('notifications')}
            </label>
            <button className={styles.button} onClick={handleSave}>{t('save')}</button>
            {message && <p className={styles.message}>{message}</p>}

            {/* Danger Zone - Breakup */}
            {hasCouple && (
                <div className={styles.dangerZone}>
                    <h3 className={styles.dangerTitle}>{t('dangerZone')}</h3>
                    <p className={styles.dangerDesc}>
                        {t('breakupWarning')}
                    </p>

                    {!showBreakupConfirm ? (
                        <button
                            className={styles.breakupBtn}
                            onClick={() => setShowBreakupConfirm(true)}
                        >
                            {t('breakup')}
                        </button>
                    ) : (
                        <div className={styles.confirmBox}>
                            <p className={styles.confirmText}>
                                {t('breakupConfirm')}
                            </p>
                            <div className={styles.confirmActions}>
                                <button
                                    className={styles.confirmYes}
                                    onClick={handleBreakup}
                                    disabled={breakupLoading}
                                >
                                    {breakupLoading ? t('loading') : t('confirmBreakup')}
                                </button>
                                <button
                                    className={styles.confirmNo}
                                    onClick={() => setShowBreakupConfirm(false)}
                                    disabled={breakupLoading}
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
