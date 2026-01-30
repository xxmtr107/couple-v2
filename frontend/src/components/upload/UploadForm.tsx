import React, { useRef, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { mediaService } from '../../services/mediaService';
import { MAX_FILE_SIZE } from '../../config/constants';
import { useTranslation } from '../../config/i18n';
import styles from './UploadForm.module.css';
import { useNavigate } from 'react-router-dom';

interface UploadItem {
    file: File;
    preview: string;
    caption: string;
    tags: string;
    mediaDate: string;
}

export const UploadForm: React.FC = () => {
    const { t } = useTranslation();
    const [items, setItems] = useState<UploadItem[]>([]);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // =========================
    // HANDLE FILE (mobile-safe)
    // =========================
    const handleFiles = async (fileList: FileList | null) => {
        if (!fileList) return;

        const newItems: UploadItem[] = [];

        for (const file of Array.from(fileList)) {
            if (file.size > MAX_FILE_SIZE) {
                setError(t('uploadFailed'));
                continue;
            }

            const preview = await fileToBase64(file);

            newItems.push({
                file,
                preview,
                caption: '',
                tags: '',
                mediaDate: '',
            });
        }

        setItems(prev => [...prev, ...newItems]);
        setError('');

        // reset input để chọn lại cùng file không bị lỗi
        if (inputRef.current) inputRef.current.value = '';
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            setError(t('selectFile'));
            return;
        }

        setUploading(true);

        try {
            for (const item of items) {
                const formData = new FormData();
                formData.append('file', item.file);
                formData.append('caption', item.caption);
                formData.append('tags', item.tags);
                formData.append('mediaDate', item.mediaDate);

                await mediaService.upload(formData);
            }

            navigate('/');
        } catch {
            setError(t('uploadFailed'));
        } finally {
            setUploading(false);
        }
    };

    const removeItem = (idx: number) => {
        setItems(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <Card className={styles.card}>
            <form onSubmit={handleSubmit}>
                {/* =========================
            CHOOSE FILE (SAFE)
        ========================= */}
                <label className={styles.dropzone}>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className={styles.hiddenInput}
                        onChange={e => handleFiles(e.target.files)}
                    />

                    {items.length === 0 ? (
                        <div className={styles.placeholder}>
                            <span>📸</span>
                            <p>
                                {t('selectFile')}<br />
                                <small>Hỗ trợ mobile & PC</small>
                            </p>
                        </div>
                    ) : (
                        <div className={styles.previewList}>
                            {items.map((item, idx) => (
                                <div className={styles.previewItem} key={idx}>
                                    {item.file.type.startsWith('video/') ? (
                                        <video src={item.preview} controls className={styles.preview} />
                                    ) : (
                                        <img src={item.preview} className={styles.preview} />
                                    )}

                                    <input
                                        placeholder="Caption"
                                        value={item.caption}
                                        onChange={e =>
                                            setItems(prev =>
                                                prev.map((it, i) =>
                                                    i === idx ? { ...it, caption: e.target.value } : it
                                                )
                                            )
                                        }
                                    />

                                    <input
                                        placeholder="Tag (vd: du-lich, ky-niem)"
                                        value={item.tags}
                                        onChange={e =>
                                            setItems(prev =>
                                                prev.map((it, i) =>
                                                    i === idx ? { ...it, tags: e.target.value } : it
                                                )
                                            )
                                        }
                                    />

                                    <input
                                        type="date"
                                        value={item.mediaDate}
                                        onChange={e =>
                                            setItems(prev =>
                                                prev.map((it, i) =>
                                                    i === idx ? { ...it, mediaDate: e.target.value } : it
                                                )
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className={styles.removeBtn}
                                        onClick={() => removeItem(idx)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </label>

                {error && <p className={styles.error}>{error}</p>}

                <Button
                    type="submit"
                    loading={uploading}
                    className={styles.submitBtn}
                >
                    {uploading ? t('uploading') : `💖 ${t('save')}`}
                </Button>
            </form>
        </Card>
    );
};

// =========================
// HELPER: base64 preview
// =========================
function fileToBase64(file: File): Promise<string> {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
    });
}
