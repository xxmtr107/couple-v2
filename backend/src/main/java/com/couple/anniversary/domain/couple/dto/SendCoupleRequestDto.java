package com.couple.anniversary.domain.couple.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendCoupleRequestDto {
    @NotBlank(message = "Invite code is required")
    private String inviteCode;
}
