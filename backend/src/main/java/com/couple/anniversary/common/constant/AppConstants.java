package com.couple.anniversary.common.constant;

public final class AppConstants {

    private AppConstants() {
        // Prevent instantiation
    }

    public static final String API_BASE_PATH = "/api";

    public static final long MAX_FILE_SIZE = 100L * 1024 * 1024; // 100MB

    public static final String MEDIA_TYPE_PHOTO = "PHOTO";
    public static final String MEDIA_TYPE_VIDEO = "VIDEO";
    public static final String MEDIA_TYPE_ALL = "ALL";

    public static final String DEFAULT_ROLE = "USER";

    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
}
