import React, { useEffect, useState } from 'react';
import { specialDateService } from '../../services/specialDateService';
import { SpecialDate } from '../../types';
import styles from './SpecialDatePage.module.css';

export const SpecialDatePage: React.FC = () => {
    const [dates, setDates] = useState<SpecialDate[]>([]);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<'BIRTHDAY' | 'ANNIVERSARY' | 'CUSTOM'>('CUSTOM');
    const [message, setMessage] = useState('');

    useEffect(() => {
        specialDateService.getAll().then(setDates).catch(() => { });
    }, []);

    const handleAdd = async () => {
        try {
            await specialDateService.create({ coupleId: 0, name, date, type });
            setMessage('Đã thêm ngày đặc biệt!');
            setName(''); setDate('');
            specialDateService.getAll().then(setDates);
        } catch {
            setMessage('Thêm thất bại!');
        }
    };

    const handleDelete = async (id: number) => {
        await specialDateService.delete(id);
        setDates(dates.filter(d => d.id !== id));
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Ngày đặc biệt</h2>
            <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Tên sự kiện" />
            <input className={styles.input} type="date" value={date} onChange={e => setDate(e.target.value)} />
            <select className={styles.select} value={type} onChange={e => setType(e.target.value as any)}>
                <option value="BIRTHDAY">Sinh nhật</option>
                <option value="ANNIVERSARY">Kỷ niệm</option>
                <option value="CUSTOM">Khác</option>
            </select>
            <button className={styles.button} onClick={handleAdd}>Thêm</button>
            {message && <p className={styles.message}>{message}</p>}
            <ul className={styles.dateList}>
                {dates.map(d => (
                    <li className={styles.dateItem} key={d.id}>
                        {d.name} - {d.date} ({d.type})
                        <button className={styles.deleteBtn} onClick={() => handleDelete(d.id)}>Xóa</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
