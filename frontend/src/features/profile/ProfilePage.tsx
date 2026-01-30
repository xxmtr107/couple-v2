import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, UserProfile } from '../../services/userService';
import { useTranslation } from '../../config/i18n';
import styles from './ProfilePage.module.css';

export const ProfilePage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<UserProfile>({
        id: 0,
        username: '',
        displayName: '',
        email: '',
        birthday: '',
        avatarUrl: '',
    });
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userData = await userService.getMe();
                // Convert birthday từ Instant về YYYY-MM-DD để hiển thị trong input date
                let birthdayForInput = '';
                if (userData.birthday) {
                    const date = new Date(userData.birthday);
                    if (!isNaN(date.getTime())) {
                        birthdayForInput = date.toISOString().split('T')[0];
                    }
                }
                setProfile({
                    ...userData,
                    birthday: birthdayForInput,
                });
                if (userData.avatarUrl) {
                    setPreviewUrl(userData.avatarUrl);
                }
            } catch {
                // Fallback to localStorage
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    try {
                        const userData = JSON.parse(savedUser);
                        setProfile(prev => ({ ...prev, ...userData }));
                        if (userData.avatarUrl) {
                            setPreviewUrl(userData.avatarUrl);
                        }
                    } catch { }
                }
            } finally {
                setInitialLoading(false);
            }
        };
        loadProfile();
    }, []);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage('Chỉ chấp nhận file ảnh!');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setMessage('File quá lớn! Tối đa 5MB.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        // Preview immediately
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to server
        setMessage('Đang upload...');
        try {
            const result = await userService.uploadAvatar(file);
            if (result.avatarUrl) {
                setPreviewUrl(result.avatarUrl);
                setProfile(prev => ({ ...prev, avatarUrl: result.avatarUrl }));
                setMessage('Avatar đã được cập nhật! 📸');
            } else {
                setMessage('Upload thất bại - không nhận được URL');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setMessage('Upload avatar thất bại! Thử ảnh nhỏ hơn.');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(true);

        try {
            await userService.updateProfile({
                displayName: profile.displayName,
                email: profile.email,
                birthday: profile.birthday,
            });

            // Also update localStorage for fallback
            localStorage.setItem('user', JSON.stringify(profile));

            setMessage(t('saved'));
        } catch {
            setMessage(t('saveFailed'));
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (initialLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <span>💕</span>
                    <p>{t('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Background decorations */}
            <div className={styles.bgDecor1}></div>
            <div className={styles.bgDecor2}></div>

            <div className={styles.profileCard}>
                {/* Avatar Section */}
                <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="Avatar" className={styles.avatarImg} />
                        ) : (
                            <span className={styles.avatarPlaceholder}>👤</span>
                        )}
                        <div className={styles.avatarOverlay}>
                            <span>📷</span>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={styles.hiddenInput}
                    />
                    <p className={styles.avatarHint}>{t('changeAvatar')}</p>
                </div>

                {/* Profile Form */}
                <div className={styles.formSection}>
                    <h2 className={styles.title}>{t('profileTitle')}</h2>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('username')}</label>
                        <input
                            type="text"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="username"
                            disabled
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('displayName')}</label>
                        <input
                            type="text"
                            name="displayName"
                            value={profile.displayName}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder={t('displayName')}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('email')}</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('birthday')}</label>
                        <input
                            type="date"
                            name="birthday"
                            value={profile.birthday}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    {message && <p className={styles.message}>{message}</p>}

                    <div className={styles.actions}>
                        <button
                            className={styles.saveBtn}
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? t('loading') : t('saveChanges')}
                        </button>
                        <button
                            className={styles.backBtn}
                            onClick={() => navigate(-1)}
                        >
                            ← {t('back')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
