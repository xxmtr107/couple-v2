import React from 'react';
import { PageLayout, UploadForm } from '../../components';
import { useTranslation } from '../../config/i18n';
import styles from './UploadPage.module.css';

const UploadPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <PageLayout>
            <div className={styles.container}>
                <div className={styles.intro}>
                    <h2 className={styles.title}>{t('uploadTitle')} 📸</h2>
                    <p className={styles.subtitle}>
                        {t('momentsOfLove')}
                    </p>
                </div>

                <UploadForm />
            </div>
        </PageLayout>
    );
};

export default UploadPage;
