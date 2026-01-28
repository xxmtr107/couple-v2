// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8080/uploads';

// App Configuration
export const APP_NAME = 'Our Love Story';
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

// Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
} as const;
