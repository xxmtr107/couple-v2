import api from './api';
import { Couple, CoupleRequest } from '../types';

// API Response wrapper format
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

export const coupleService = {
    // GET / - Lấy thông tin couple hiện tại (bao gồm daysTogether)
    async getMyCouple(): Promise<Couple | null> {
        try {
            const res = await api.get<ApiResponse<Couple> | Couple>('/couple');
            const data = res.data;
            if (data && 'data' in data) return data.data;
            return data as Couple;
        } catch {
            return null;
        }
    },

    // POST /request - Gửi lời mời kết nối bằng invite code
    async sendRequest(inviteCode: string): Promise<CoupleRequest> {
        const res = await api.post<ApiResponse<CoupleRequest>>('/couple/request', { inviteCode });
        return res.data.data || res.data;
    },

    // GET /requests/pending - Lấy danh sách lời mời đang chờ (từ người khác)
    async getPendingRequests(): Promise<CoupleRequest[]> {
        const res = await api.get<ApiResponse<CoupleRequest[]> | CoupleRequest[]>('/couple/requests/pending');
        const data = res.data;
        if (Array.isArray(data)) return data;
        if (data && 'data' in data) return data.data;
        return [];
    },

    // GET /my-sent-request - Lấy lời mời mà mình đã gửi (trạng thái chờ)
    async getSentRequest(): Promise<CoupleRequest | null> {
        try {
            const res = await api.get<ApiResponse<CoupleRequest> | CoupleRequest>('/couple/my-sent-request');
            const data = res.data;
            if (data && 'data' in data) return data.data;
            return data as CoupleRequest;
        } catch {
            return null;
        }
    },

    // DELETE /request/{id} - Hủy lời mời đã gửi
    async cancelRequest(requestId: number): Promise<void> {
        await api.delete(`/couple/request/${requestId}`);
    },

    // POST /request/{id}/accept - Chấp nhận lời mời
    async acceptRequest(requestId: number): Promise<CoupleRequest> {
        const res = await api.post<ApiResponse<CoupleRequest>>(`/couple/request/${requestId}/accept`);
        return res.data.data || res.data;
    },

    // POST /request/{id}/reject - Từ chối lời mời
    async rejectRequest(requestId: number): Promise<CoupleRequest> {
        const res = await api.post<ApiResponse<CoupleRequest>>(`/couple/request/${requestId}/reject`);
        return res.data.data || res.data;
    },

    // DELETE / - Hủy kết nối couple (breakup)
    async breakup(): Promise<void> {
        await api.delete('/couple');
    },

    // Helper: Tính số ngày yêu nhau (fallback nếu API không trả daysTogether)
    getDaysTogether(startDate: string): number {
        const start = new Date(startDate);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    },
};
