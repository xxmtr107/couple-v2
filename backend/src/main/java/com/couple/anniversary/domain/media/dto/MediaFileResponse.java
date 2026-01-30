package com.couple.anniversary.domain.media.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaFileResponse {

    private Long id;
    private String fileName;
    private String originalName;
    private String contentType;
    private Long size;
    private String type;
    private Instant createdAt;
    private String downloadUrl;

    // THÊM CÁC TRƯỜNG NÀY:
    private String caption;
    private String tags;        // hoặc List<String> tags
    private Instant mediaDate;
}
