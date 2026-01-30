import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coupleService } from '../../services/coupleService';
import { userService, UserProfile } from '../../services/userService';
import { Couple, CoupleRequest } from '../../types';
import { PageLayout } from '../../components';
import { useTranslation } from '../../config/i18n';
import styles from './CouplePage.module.css';

export const CouplePage: React.FC = () => {
    const { t } = useTranslation();
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
                console.log('Loaded user:', user);
                setCurrentUser(user);
            } catch (err) {
                console.error('Failed to load user:', err);
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
            } catch (err) {
                console.error('Failed to load couple:', err);
            }

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
                        <p>{t('loading')}</p>
                    </div>
                </div>
            </PageLayout>
        );
    }

    // Kiểm tra couple có valid không (phải có id)
    const hasValidCouple = couple && couple.id;

    // Nếu đã có couple - hiển thị thông tin và nút đến gallery
    if (hasValidCouple) {
        // Dùng daysTogether từ API
        const daysTogether = couple.daysTogether ?? 0;

        // Get user info - sử dụng format mới từ backend
        const user1Name = couple.user1DisplayName || couple.user1?.displayName || 'Bạn';
        const user1Avatar = couple.user1Avatar || couple.user1?.avatarUrl;
        const user2Name = couple.user2DisplayName || couple.user2?.displayName || 'Người ấy';
        const user2Avatar = couple.user2Avatar || couple.user2?.avatarUrl;

        return (
            <PageLayout>
                <div className={styles.container}>
                    <div className={styles.bgDecor1}></div>
                    <div className={styles.bgDecor2}></div>

                    <div className={styles.connectedCard}>
                        {/* Avatar của 2 người */}
                        <div className={styles.coupleAvatars}>
                            <div className={styles.avatarWrapper}>
                                {user1Avatar ? (
                                    <img src={user1Avatar} alt={user1Name} className={styles.coupleAvatar} />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        <span>👩</span>
                                    </div>
                                )}
                                <span className={styles.avatarName}>{user1Name}</span>
                            </div>

                            <div className={styles.heartBetweenWrapper}>
                                <span className={styles.heartBetween}>💕</span>
                                <div className={styles.connectionRing}></div>
                            </div>

                            <div className={styles.avatarWrapper}>
                                {user2Avatar ? (
                                    <img src={user2Avatar} alt={user2Name} className={styles.coupleAvatar} />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        <span>👨</span>
                                    </div>
                                )}
                                <span className={styles.avatarName}>{user2Name}</span>
                            </div>
                        </div>

                        <h2 className={styles.connectedTitle}>{t('connected')}</h2>

                        <div className={styles.daysCounter}>
                            <span className={styles.daysNumber}>{daysTogether}</span>
                            <span className={styles.daysLabel}>{t('daysTogetherLabel')}</span>
                        </div>

                        <div className={styles.connectedActions}>
                            <button className={styles.primaryBtn} onClick={() => navigate('/')}>
                                {t('viewMemories')}
                            </button>
                            <button className={styles.secondaryBtn} onClick={() => navigate('/upload')}>
                                {t('uploadMemory')}
                            </button>
                            <button className={styles.tertiaryBtn} onClick={() => navigate('/settings')}>
                                {t('coupleSettings')}
                            </button>
                        </div>
                    </div>
                </div>
            </PageLayout>
        );
    }

    // Generate inviteCode nếu backend chưa có
    const generateInviteCode = (userId: number): string => {
        return `HEART-${userId.toString().padStart(4, '0')}`;
    };

    const inviteCode = currentUser?.inviteCode ||
        (currentUser?.id ? generateInviteCode(currentUser.id) : 'Đang tải...');
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
                        <h2 className={styles.waitingTitle}>{t('pendingTitle')}</h2>
                        <p className={styles.waitingText}>
                            {t('pendingSent')} <strong>{sentRequest.toUser?.displayName || sentRequest.toUser?.username || 'người ấy'}</strong>
                        </p>
                        <p className={styles.waitingHint}>
                            {t('pendingWait')}
                        </p>

                        <div className={styles.waitingActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={handleCancelRequest}
                            >
                                ✕ {t('cancelInvite')}
                            </button>
                            <p className={styles.cancelHint}>
                                {t('cancelHint')}
                            </p>
                        </div>
                    </div>

                    {/* Vẫn hiển thị pending requests từ người khác */}
                    {pendingRequests.length > 0 && (
                        <div className={styles.requestsSection}>
                            <h3 className={styles.requestsTitle}>{t('pendingRequests')}</h3>
                            {pendingRequests.map(r => (
                                <div className={styles.requestCard} key={r.id}>
                                    <div className={styles.requestInfo}>
                                        <span className={styles.requestAvatar}>👤</span>
                                        <span>{r.fromUser?.displayName || r.fromUser?.username || 'Ai đó'}</span>
                                    </div>
                                    <div className={styles.requestActions}>
                                        <button
                                            className={styles.acceptBtn}
                                            onClick={() => handleRespond(r.id, true)}
                                        >
                                            ✓ {t('accept')}
                                        </button>
                                        <button
                                            className={styles.rejectBtn}
                                            onClick={() => handleRespond(r.id, false)}
                                        >
                                            ✕ {t('reject')}
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
                <h1 className={styles.title}>{t('waitingTitle')}</h1>
                <p className={styles.subtitle}>
                    {t('waitingSubtitle')}
                </p>

                {/* Cards Container */}
                <div className={styles.cardsContainer}>
                    {/* Your Invite Code Card */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>{t('yourInviteCode')}</h3>
                        <p className={styles.cardDesc}>
                            {t('shareCodeDesc')}
                        </p>
                        <div className={styles.codeBox}>
                            <span className={styles.code}>{inviteCode}</span>
                            <button className={styles.copyBtn} onClick={copyInviteCode}>
                                📋
                            </button>
                        </div>
                        <button className={styles.shareBtn} onClick={copyInviteCode}>
                            <span>📤</span> {t('shareInvite')}
                        </button>
                    </div>

                    {/* Enter Partner's Code Card */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>{t('enterPartnerCode')}</h3>
                        <p className={styles.cardDesc}>
                            {t('enterCodeDesc')}
                        </p>
                        <input
                            type="text"
                            className={styles.codeInput}
                            placeholder={t('codePlaceholder')}
                            value={partnerCode}
                            onChange={(e) => setPartnerCode(e.target.value)}
                        />
                        <button className={styles.connectBtn} onClick={handleConnect}>
                            <span>🔗</span> {t('connectNow')}
                        </button>
                    </div>
                </div>

                {/* Message */}
                {message && <p className={styles.message}>{message}</p>}

                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                    <div className={styles.requestsSection}>
                        <h3 className={styles.requestsTitle}>{t('pendingRequests')}</h3>
                        {pendingRequests.map(r => (
                            <div className={styles.requestCard} key={r.id}>
                                <div className={styles.requestInfo}>
                                    <span className={styles.requestAvatar}>👤</span>
                                    <span>{r.fromUser?.displayName || r.fromUser?.username || 'Ai đó'} {t('someoneWantsConnect')}</span>
                                </div>
                                <div className={styles.requestActions}>
                                    <button
                                        className={styles.acceptBtn}
                                        onClick={() => handleRespond(r.id, true)}
                                    >
                                        ✓ {t('accept')}
                                    </button>
                                    <button
                                        className={styles.rejectBtn}
                                        onClick={() => handleRespond(r.id, false)}
                                    >
                                        ✕ {t('reject')}
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
                </div>
            </div>
            );
        </PageLayout>
    )
};



