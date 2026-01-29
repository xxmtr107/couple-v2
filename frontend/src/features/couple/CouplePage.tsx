import React, { useEffect, useState } from 'react';
import { coupleService } from '../../services/coupleService';
import { Couple, CoupleRequest } from '../../types';
import styles from './CouplePage.module.css';

export const CouplePage: React.FC = () => {
    const [couple, setCouple] = useState<Couple | null>(null);
    const [requests, setRequests] = useState<CoupleRequest[]>([]);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        coupleService.getCouple().then(setCouple).catch(() => { });
        coupleService.getRequests().then(setRequests).catch(() => { });
    }, []);

    const handleSendRequest = async () => {
        try {
            await coupleService.sendRequest(username);
            setMessage('Đã gửi yêu cầu ghép đôi!');
        } catch {
            setMessage('Gửi yêu cầu thất bại!');
        }
    };

    const handleRespond = async (id: number, accept: boolean) => {
        await coupleService.respondRequest(id, accept);
        setRequests((prev) => prev.filter((r) => r.id !== id));
        setMessage(accept ? 'Đã xác nhận ghép đôi!' : 'Đã từ chối yêu cầu!');
    };

    if (couple) {
        return (
            <div className={styles.container}>
                <div className={styles.coupleInfo}>
                    <h2 className={styles.title}>Đã ghép đôi 💑</h2>
                    <p>
                        {couple.user1.displayName || couple.user1.username}
                        {' '} & {' '}
                        {couple.user2.displayName || couple.user2.username}
                    </p>
                    <p>Bắt đầu từ: {new Date(couple.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Ghép đôi với người thương 💑</h2>
            <input className={styles.input} value={username} onChange={e => setUsername(e.target.value)} placeholder="Nhập username người kia" />
            <button className={styles.button} onClick={handleSendRequest}>Gửi yêu cầu</button>
            {message && <p className={styles.message}>{message}</p>}
            <h3>Yêu cầu chờ xác nhận:</h3>
            <ul className={styles.requestList}>
                {requests.map(r => (
                    <li className={styles.requestItem} key={r.id}>
                        {r.fromUser.username} gửi cho {r.toUser.username} - {r.status}
                        {r.status === 'PENDING' && (
                            <span>
                                <button className={styles.confirmBtn} onClick={() => handleRespond(r.id, true)}>Xác nhận</button>
                                <button className={styles.rejectBtn} onClick={() => handleRespond(r.id, false)}>Từ chối</button>
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
