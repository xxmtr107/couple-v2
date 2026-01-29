
export type MediaType = 'PHOTO' | 'VIDEO';

export interface User {
    id: number;
    username: string;
    email?: string;
    displayName?: string;
    birthday?: string;
    avatarUrl?: string;
    coupleId?: number;
}

export interface Couple {
    id: number;
    user1: User;
    user2: User;
    createdAt: string;
    settings?: CoupleSettings;
}

export interface CoupleRequest {
    id: number;
    fromUser: User;
    toUser: User;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
}

export interface Media {
    id: number;
    fileName: string;
    type: MediaType;
    originalName: string;
    contentType: string;
    createdAt?: string;
    caption?: string;
    tags?: string[];
    mediaDate?: string;
    coupleId?: number;
    url?: string;
}

export interface CoupleSettings {
    id: number;
    coupleId: number;
    theme?: string;
    font?: string;
    background?: string;
    notificationsEnabled?: boolean;
}

export interface SpecialDate {
    id: number;
    coupleId: number;
    type: 'BIRTHDAY' | 'ANNIVERSARY' | 'CUSTOM';
    name: string;
    date: string;
    userId?: number; // birthday của từng user
}

export interface Notification {
    id: number;
    userId: number;
    content: string;
    read: boolean;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    user?: User;
}

export interface ApiError {
    message: string;
    status?: number;
}
