package com.couple.anniversary.domain.couple.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoupleRequestResponse {
    private Long id;
    private Long fromUserId;
    private String fromUserDisplayName;
    private String fromUserAvatar;
    private Long toUserId;
    private String toUserDisplayName;
    private String toUserAvatar;
    private String status;
    private Instant createdAt;
}
