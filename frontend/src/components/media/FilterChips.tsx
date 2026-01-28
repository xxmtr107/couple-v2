import React from 'react';
import { MediaType } from '../../types';
import styles from './FilterChips.module.css';

type FilterValue = MediaType | 'ALL';

interface FilterChipsProps {
    value: FilterValue;
    onChange: (value: FilterValue) => void;
}

const FILTERS: { value: FilterValue; label: string; icon: string }[] = [
    { value: 'ALL', label: 'Tất cả', icon: '💫' },
    { value: 'PHOTO', label: 'Ảnh', icon: '📷' },
    { value: 'VIDEO', label: 'Video', icon: '🎬' },
];

export const FilterChips: React.FC<FilterChipsProps> = ({ value, onChange }) => {
    return (
        <div className={styles.container}>
            {FILTERS.map((filter) => (
                <button
                    key={filter.value}
                    className={`${styles.chip} ${value === filter.value ? styles.active : ''}`}
                    onClick={() => onChange(filter.value)}
                >
                    <span className={styles.icon}>{filter.icon}</span>
                    {filter.label}
                </button>
            ))}
        </div>
    );
};
