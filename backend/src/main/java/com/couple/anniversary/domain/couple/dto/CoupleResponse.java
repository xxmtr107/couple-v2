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
public class CoupleResponse {
    private Long id;
    private Long user1Id;
    private String user1DisplayName;
    private String user1Avatar;
    private Long user2Id;
    private String user2DisplayName;
    private String user2Avatar;
    private Instant anniversaryDate;
    private Long daysTogether;
    private String status;
    private Instant createdAt;
}
