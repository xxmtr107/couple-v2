import React, { useEffect, useState } from 'react';
import { notificationService } from '../../services/notificationService';
import { Notification } from '../../types';
import styles from './NotificationList.module.css';

export const NotificationList: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        notificationService.getAll().then(setNotifications).catch(() => { });
    }, []);

    const handleMarkRead = async (id: number) => {
        await notificationService.markRead(id);
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Thông báo</h2>
            <ul className={styles.list}>
                {notifications.map(n => (
                    <li className={styles.item + (n.read ? ' ' + styles.read : '')} key={n.id}>
                        <span>{n.content}</span> <span>({new Date(n.createdAt).toLocaleString()})</span>
                        {!n.read && <button className={styles.markBtn} onClick={() => handleMarkRead(n.id)}>Đã đọc</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
};
