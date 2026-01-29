
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { mediaService } from '../../services/mediaService';
import { MAX_FILE_SIZE } from '../../config/constants';
import styles from './UploadForm.module.css';

interface UploadItem {
    file: File;
    preview: string;
    caption: string;
    tags: string;
    mediaDate: string;
}

export const UploadForm: React.FC = () => {
    const [items, setItems] = useState<UploadItem[]>([]);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleFiles = (fileList: FileList | null) => {
        if (!fileList) return;
        const newItems: UploadItem[] = [];
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            if (file.size > MAX_FILE_SIZE) {
                setError('File quá lớn! Tối đa 100MB nhé babe 💔');
                continue;
            }
            newItems.push({
                file,
                preview: URL.createObjectURL(file),
                caption: '',
                tags: '',
                mediaDate: '',
            });
        }
        setItems((prev) => [...prev, ...newItems]);
        setError('');
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleInputChange = (idx: number, field: keyof Omit<UploadItem, 'file' | 'preview'>, value: string) => {
        setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
    };

    const handleRemove = (idx: number) => {
        setItems((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            setError('Chọn file đi babe! 😊');
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
            setError('Upload thất bại 😢 Thử lại nhé!');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className={styles.card}>
            <form onSubmit={handleSubmit}>
                <div
                    className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    {items.length === 0 ? (
                        <div className={styles.placeholder}>
                            <span className={styles.icon}>📸</span>
                            <p className={styles.text}>
                                Kéo thả nhiều ảnh/video vào đây
                                <br />
                                <span className={styles.subtext}>hoặc click để chọn file</span>
                            </p>
                        </div>
                    ) : (
                        <div className={styles.previewList}>
                            {items.map((item, idx) => (
                                <div className={styles.previewItem} key={idx}>
                                    {item.file.type.startsWith('video/') ? (
                                        <video src={item.preview} className={styles.preview} controls />
                                    ) : (
                                        <img src={item.preview} alt="Preview" className={styles.preview} />
                                    )}
                                    <input
                                        className={styles.input}
                                        placeholder="Caption cho kỷ niệm này"
                                        value={item.caption}
                                        onChange={e => handleInputChange(idx, 'caption', e.target.value)}
                                    />
                                    <input
                                        className={styles.input}
                                        placeholder="Tag (phân cách bởi dấu phẩy)"
                                        value={item.tags}
                                        onChange={e => handleInputChange(idx, 'tags', e.target.value)}
                                    />
                                    <input
                                        className={styles.input}
                                        type="date"
                                        value={item.mediaDate}
                                        onChange={e => handleInputChange(idx, 'mediaDate', e.target.value)}
                                    />
                                    <button type="button" className={styles.removeBtn} onClick={e => { e.stopPropagation(); handleRemove(idx); }}>✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*,video/*"
                        className={styles.input}
                        multiple
                        onChange={e => handleFiles(e.target.files)}
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    loading={uploading}
                    className={styles.submitBtn}
                >
                    {uploading ? 'Đang upload...' : '💖 Lưu kỷ niệm'}
                </Button>
            </form>
        </Card>
    );
};
