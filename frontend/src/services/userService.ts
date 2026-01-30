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
    birthday?: string; // Frontend dùng string, sẽ convert khi gửi
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
        // Convert birthday từ "YYYY-MM-DD" sang Instant (ISO string) nếu có
        const payload: Record<string, unknown> = {
            displayName: profileData.displayName,
            email: profileData.email,
        };

        if (profileData.birthday) {
            // Convert local date string to Instant (ISO format với timezone)
            const date = new Date(profileData.birthday);
            if (!isNaN(date.getTime())) {
                payload.birthday = date.toISOString();
            }
        }

        const res = await api.put<ApiResponse<UserProfile> | UserProfile>('/users/profile', payload);
        const data = res.data;
        if (data && 'data' in data) return data.data;
        return data as UserProfile;
    },

    // POST /avatar - Upload avatar
    // Backend trả về ApiResponse<UserResponse> với full user info
    async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);

        // KHÔNG set Content-Type header - để browser tự thêm boundary
        const res = await api.post<ApiResponse<UserProfile>>('/users/avatar', formData);

        const data = res.data;
        // Backend trả về UserResponse trong data.data
        const userResponse = data.data || (data as unknown as UserProfile);
        return { avatarUrl: userResponse.avatarUrl || '' };
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
