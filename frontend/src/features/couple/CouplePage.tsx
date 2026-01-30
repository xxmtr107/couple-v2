import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coupleService } from '../../services/coupleService';
import { userService, UserProfile } from '../../services/userService';
import { Couple, CoupleRequest } from '../../types';
import { PageLayout } from '../../components';
import styles from './CouplePage.module.css';

export const CouplePage: React.FC = () => {
    const [couple, setCouple] = useState<Couple | null>(null);
    const [requests, setRequests] = useState<CoupleRequest[]>([]);
    const [sentRequest, setSentRequest] = useState<CoupleRequest | null>(null);
    const [partnerCode, setPartnerCode] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            // Load current user from API
            try {
                const user = await userService.getMe();
                setCurrentUser(user);
            } catch {
                // Fallback to localStorage
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    try {
                        setCurrentUser(JSON.parse(savedUser));
                    } catch { }
                }
            }

            // Load couple
            try {
                const coupleData = await coupleService.getMyCouple();
                setCouple(coupleData);
            } catch { }

            // Load pending requests (from others)
            try {
                const requestsData = await coupleService.getPendingRequests();
                setRequests(requestsData);
            } catch { }

            // Load sent request
            try {
                const sent = await coupleService.getSentRequest();
                setSentRequest(sent);
            } catch { }

            setLoading(false);
        };

        loadData();
    }, []);

    const handleConnect = async () => {
        if (!partnerCode.trim()) {
            setMessage('Vui lòng nhập mã của người ấy!');
            return;
        }

        try {
            const request = await coupleService.sendRequest(partnerCode);
            setSentRequest(request);
            setMessage('Đã gửi yêu cầu kết nối! Đang chờ phản hồi... 💕');
            setPartnerCode('');
        } catch {
            setMessage('Không tìm thấy người dùng với mã này!');
        }
    };

    const handleCancelRequest = async () => {
        if (!sentRequest) return;

        try {
            await coupleService.cancelRequest(sentRequest.id);
            setSentRequest(null);
            setMessage('Đã hủy lời mời! Bạn có thể gửi cho người khác.');
        } catch {
            setMessage('Không thể hủy lời mời!');
        }
    };

    const handleRespond = async (id: number, accept: boolean) => {
        try {
            if (accept) {
                await coupleService.acceptRequest(id);
                setMessage('Đã kết nối thành công! Đang chuyển hướng... 💕');
                setTimeout(() => navigate('/'), 1500);
            } else {
                await coupleService.rejectRequest(id);
                setMessage('Đã từ chối yêu cầu.');
            }
            setRequests((prev) => prev.filter((r) => r.id !== id));
        } catch {
            setMessage('Có lỗi xảy ra!');
        }
    };

    const copyInviteCode = () => {
        const code = currentUser?.inviteCode || 'LOADING...';
        navigator.clipboard.writeText(code);
        setMessage('Đã copy mã mời! 📋');
        setTimeout(() => setMessage(''), 2000);
    };

    if (loading) {
        return (
            <PageLayout>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <span className={styles.loadingIcon}>💕</span>
                        <p>Đang tải...</p>
                    </div>
                </div>
            </PageLayout>
        );
    }

    // Nếu đã có couple - hiển thị thông tin và nút đến gallery
    if (couple) {
        // Dùng daysTogether từ API nếu có, fallback sang tính local
        const daysTogether = (couple as any).daysTogether ?? coupleService.getDaysTogether(couple.createdAt);

        return (
            <PageLayout>
                <div className={styles.container}>
                    <div className={styles.connectedCard}>
                        {/* Avatar của 2 người */}
                        <div className={styles.coupleAvatars}>
                            <div className={styles.avatarWrapper}>
                                {couple.user1?.avatarUrl ? (
                                    <img src={couple.user1.avatarUrl} alt={couple.user1.displayName || couple.user1.username} className={styles.coupleAvatar} />
                                ) : (
                                    <span className={styles.avatarPlaceholder}>👤</span>
                                )}
                            </div>
                            <span className={styles.heartBetween}>💕</span>
                            <div className={styles.avatarWrapper}>
                                {couple.user2?.avatarUrl ? (
                                    <img src={couple.user2.avatarUrl} alt={couple.user2.displayName || couple.user2.username} className={styles.coupleAvatar} />
                                ) : (
                                    <span className={styles.avatarPlaceholder}>👤</span>
                                )}
                            </div>
                        </div>
                        <h2>Đã kết nối!</h2>
                        <p className={styles.coupleNames}>
                            {couple.user1?.displayName || couple.user1?.username || 'Bạn'}
                            {' '} & {' '}
                            {couple.user2?.displayName || couple.user2?.username || 'Người ấy'}
                        </p>
                        <div className={styles.daysCounter}>
                            <span className={styles.daysNumber}>{daysTogether}</span>
                            <span className={styles.daysLabel}>ngày bên nhau</span>
                        </div>
                        <button className={styles.primaryBtn} onClick={() => navigate('/')}>
                            📸 Xem kỷ niệm
                        </button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    const inviteCode = currentUser?.inviteCode || 'Đang tải...';
    const pendingRequests = requests.filter(r => r.status === 'PENDING');

    // Nếu đang chờ phản hồi từ người khác
    if (sentRequest && sentRequest.status === 'PENDING') {
        return (
            <PageLayout>
                <div className={styles.container}>
                    <div className={styles.bgDecor1}></div>
                    <div className={styles.bgDecor2}></div>

                    <div className={styles.waitingCard}>
                        <span className={styles.waitingIcon}>⏳</span>
                        <h2 className={styles.waitingTitle}>Đang chờ phản hồi...</h2>
                        <p className={styles.waitingText}>
                            Bạn đã gửi lời mời đến <strong>{sentRequest.toUser.displayName || sentRequest.toUser.username}</strong>
                        </p>
                        <p className={styles.waitingHint}>
                            Hãy chờ người ấy xác nhận nhé! 💕
                        </p>

                        <div className={styles.waitingActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={handleCancelRequest}
                            >
                                ✕ Hủy lời mời
                            </button>
                            <p className={styles.cancelHint}>
                                (Hủy để gửi cho người khác)
                            </p>
                        </div>
                    </div>

                    {/* Vẫn hiển thị pending requests từ người khác */}
                    {pendingRequests.length > 0 && (
                        <div className={styles.requestsSection}>
                            <h3 className={styles.requestsTitle}>Có người muốn kết nối với bạn:</h3>
                            {pendingRequests.map(r => (
                                <div className={styles.requestCard} key={r.id}>
                                    <div className={styles.requestInfo}>
                                        <span className={styles.requestAvatar}>👤</span>
                                        <span>{r.fromUser.displayName || r.fromUser.username}</span>
                                    </div>
                                    <div className={styles.requestActions}>
                                        <button
                                            className={styles.acceptBtn}
                                            onClick={() => handleRespond(r.id, true)}
                                        >
                                            ✓ Chấp nhận
                                        </button>
                                        <button
                                            className={styles.rejectBtn}
                                            onClick={() => handleRespond(r.id, false)}
                                        >
                                            ✕ Từ chối
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className={styles.container}>
                {/* Background decorations */}
                <div className={styles.bgDecor1}></div>
                <div className={styles.bgDecor2}></div>

                {/* Heart Icon */}
                <div className={styles.heartBadge}>
                    <span>💕</span>
                </div>

                {/* Title */}
                <h1 className={styles.title}>Waiting for your better half...</h1>
                <p className={styles.subtitle}>
                    Connect with your partner to start building your 12-month memory timeline together.
                </p>

                {/* Cards Container */}
                <div className={styles.cardsContainer}>
                    {/* Your Invite Code Card */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Your Invite Code</h3>
                        <p className={styles.cardDesc}>
                            Share this code with your partner to sync your accounts.
                        </p>
                        <div className={styles.codeBox}>
                            <span className={styles.code}>{inviteCode}</span>
                            <button className={styles.copyBtn} onClick={copyInviteCode}>
                                📋
                            </button>
                        </div>
                        <button className={styles.shareBtn} onClick={copyInviteCode}>
                            <span>📤</span> Share Invite
                        </button>
                    </div>

                    {/* Enter Partner's Code Card */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Enter Partner's Code</h3>
                        <p className={styles.cardDesc}>
                            Have an invite code from your partner? Paste it here.
                        </p>
                        <input
                            type="text"
                            className={styles.codeInput}
                            placeholder="e.g. HEART-1234"
                            value={partnerCode}
                            onChange={(e) => setPartnerCode(e.target.value)}
                        />
                        <button className={styles.connectBtn} onClick={handleConnect}>
                            <span>🔗</span> Connect Now
                        </button>
                    </div>
                </div>

                {/* Message */}
                {message && <p className={styles.message}>{message}</p>}

                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                    <div className={styles.requestsSection}>
                        <h3 className={styles.requestsTitle}>Yêu cầu kết nối đang chờ:</h3>
                        {pendingRequests.map(r => (
                            <div className={styles.requestCard} key={r.id}>
                                <div className={styles.requestInfo}>
                                    <span className={styles.requestAvatar}>👤</span>
                                    <span>{r.fromUser.displayName || r.fromUser.username} muốn kết nối với bạn</span>
                                </div>
                                <div className={styles.requestActions}>
                                    <button
                                        className={styles.acceptBtn}
                                        onClick={() => handleRespond(r.id, true)}
                                    >
                                        ✓ Chấp nhận
                                    </button>
                                    <button
                                        className={styles.rejectBtn}
                                        onClick={() => handleRespond(r.id, false)}
                                    >
                                        ✕ Từ chối
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Connection Visual */}
                <div className={styles.connectionVisual}>
                    <div className={styles.visualCard}>
                        <div className={styles.avatarLeft}>
                            <span>👩</span>
                        </div>
                        <div className={styles.connectionLine}>
                            <span>💕</span>
                            <div className={styles.dashedLine}></div>
                            <span>💕</span>
                        </div>
                        <div className={styles.avatarRight}>
                            <span>👤</span>
                        </div>
                    </div>
                    <p className={styles.visualText}>
                        Once connected, you'll be able to share photos and create your story together.
                    </p>
                </div>
            </div>
            );
        </PageLayout>
    )
};



