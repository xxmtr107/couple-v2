package com.couple.anniversary.domain.media.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class MediaUploadRequest {

    @NotNull(message = "File is required")
    private MultipartFile file;
}
