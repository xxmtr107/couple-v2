import api from './api';
import { User } from '../types';

// API Response wrapper format
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

export interface UserProfile {
    id: number;
    username: string;
    displayName?: string;
    email?: string;
    birthday?: string;
    avatarUrl?: string;
    inviteCode?: string;
    coupleId?: number;
    createdAt?: string;
}

export interface UpdateProfileData {
    displayName?: string;
    email?: string;
    birthday?: string;
}

export const userService = {
    // GET /me - Lấy thông tin user hiện tại (bao gồm coupleId, inviteCode)
    async getMe(): Promise<UserProfile> {
        const res = await api.get<ApiResponse<UserProfile> | UserProfile>('/users/me');
        const data = res.data;
        if (data && 'data' in data) return data.data;
        return data as UserProfile;
    },

    // PUT /profile - Cập nhật profile (displayName, email, birthday)
    async updateProfile(profileData: UpdateProfileData): Promise<UserProfile> {
        const res = await api.put<ApiResponse<UserProfile> | UserProfile>('/users/profile', profileData);
        const data = res.data;
        if (data && 'data' in data) return data.data;
        return data as UserProfile;
    },

    // POST /avatar - Upload avatar
    async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
        const formData = new FormData();
        formData.append('avatar', file);

        const res = await api.post<ApiResponse<{ avatarUrl: string }> | { avatarUrl: string }>('/users/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        const data = res.data;
        if (data && 'data' in data) return data.data;
        return data as { avatarUrl: string };
    },

    // Helper: Lấy inviteCode từ user
    async getMyInviteCode(): Promise<string | null> {
        try {
            const user = await userService.getMe();
            return user.inviteCode || null;
        } catch {
            return null;
        }
    },
};
