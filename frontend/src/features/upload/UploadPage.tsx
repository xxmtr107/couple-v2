import React from 'react';
import { PageLayout, UploadForm } from '../../components';
import styles from './UploadPage.module.css';

const UploadPage: React.FC = () => {
    return (
        <PageLayout>
            <div className={styles.container}>
                <div className={styles.intro}>
                    <h2 className={styles.title}>Thêm kỷ niệm mới 📸</h2>
                    <p className={styles.subtitle}>
                        Lưu giữ những khoảnh khắc đẹp của chúng mình
                    </p>
                </div>

                <UploadForm />
            </div>
        </PageLayout>
    );
};

export default UploadPage;
