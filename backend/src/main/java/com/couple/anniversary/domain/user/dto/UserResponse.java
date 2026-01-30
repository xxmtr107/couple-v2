package com.couple.anniversary.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String displayName;
    private Instant birthday;
    private String avatarUrl;
    private Long coupleId;
    private String inviteCode;
    private Instant createdAt;
}
