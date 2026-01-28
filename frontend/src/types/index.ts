export type MediaType = 'PHOTO' | 'VIDEO';

export interface Media {
    id: number;
    fileName: string;
    type: MediaType;
    originalName: string;
    contentType: string;
    createdAt?: string;
}

export interface User {
    id: number;
    username: string;
}

export interface AuthResponse {
    token: string;
    user?: User;
}

export interface ApiError {
    message: string;
    status?: number;
}
