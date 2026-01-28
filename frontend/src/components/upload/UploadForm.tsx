import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { mediaService } from '../../services/mediaService';
import { MAX_FILE_SIZE } from '../../config/constants';
import styles from './UploadForm.module.css';

export const UploadForm: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleFile = (selectedFile: File | null) => {
        if (!selectedFile) return;

        if (selectedFile.size > MAX_FILE_SIZE) {
            setError('File quá lớn! Tối đa 100MB nhé babe 💔');
            return;
        }

        setFile(selectedFile);
        setError('');

        // Create preview
        const url = URL.createObjectURL(selectedFile);
        setPreview(url);
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

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Chọn file đi babe! 😊');
            return;
        }

        setUploading(true);
        try {
            await mediaService.upload(file);
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
                    className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''} ${preview ? styles.hasPreview : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    {preview ? (
                        <div className={styles.previewWrapper}>
                            {file?.type.startsWith('video/') ? (
                                <video src={preview} className={styles.preview} controls />
                            ) : (
                                <img src={preview} alt="Preview" className={styles.preview} />
                            )}
                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                    setPreview(null);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <div className={styles.placeholder}>
                            <span className={styles.icon}>📸</span>
                            <p className={styles.text}>
                                Kéo thả ảnh/video vào đây
                                <br />
                                <span className={styles.subtext}>hoặc click để chọn file</span>
                            </p>
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*,video/*"
                        className={styles.input}
                        onChange={(e) => handleFile(e.target.files?.[0] || null)}
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
