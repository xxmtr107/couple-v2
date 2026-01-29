package com.couple.anniversary.domain.media.service;

import com.couple.anniversary.common.constant.AppConstants;
import com.couple.anniversary.common.exception.BadRequestException;
import com.couple.anniversary.common.exception.ForbiddenException;
import com.couple.anniversary.common.exception.ResourceNotFoundException;
import com.couple.anniversary.domain.media.dto.MediaFileResponse;
import com.couple.anniversary.domain.media.entity.MediaFile;
import com.couple.anniversary.domain.media.repository.MediaFileRepository;
import com.couple.anniversary.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.cloudinary.utils.StringUtils as CloudinaryStringUtils;
import com.cloudinary.Transformation;
import com.cloudinary.Singleton;
import com.cloudinary.Api;
import com.cloudinary.api.exceptions.ApiException;
import com.cloudinary.api.exceptions.NotFound;
import com.cloudinary.api.exceptions.BadRequest;
import com.cloudinary.api.exceptions.AuthorizationRequired;
import com.cloudinary.api.exceptions.GeneralError;
import com.cloudinary.api.exceptions.RateLimited;
import com.cloudinary.api.exceptions.Timeout;
import com.cloudinary.api.exceptions.TooLarge;
import com.cloudinary.api.exceptions.UnsupportedFormat;
import com.cloudinary.api.exceptions.UploadError;
import com.cloudinary.api.exceptions.UploadPresetNotFound;
import com.cloudinary.api.exceptions.UploadPresetRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateError;
import com.cloudinary.api.exceptions.UploadPresetUpdateNotAllowed;
import com.cloudinary.api.exceptions.UploadPresetUpdateRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateTooLarge;
import com.cloudinary.api.exceptions.UploadPresetUpdateUnsupportedFormat;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadError;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetNotFound;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateError;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateNotAllowed;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateTooLarge;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUnsupportedFormat;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadError;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetNotFound;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateError;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateNotAllowed;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateTooLarge;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUnsupportedFormat;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadError;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetNotFound;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateError;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateNotAllowed;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateTooLarge;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUnsupportedFormat;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadError;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetNotFound;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateError;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateNotAllowed;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateTooLarge;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUnsupportedFormat;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadError;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetNotFound;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateError;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateNotAllowed;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateTooLarge;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUnsupportedFormat;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadError;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetNotFound;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateError;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateNotAllowed;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateRequired;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateTooLarge;
import com.cloudinary.api.exceptions.UploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUploadPresetUpdateUnsupportedFormat;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MediaService {

    private final MediaFileRepository mediaFileRepository;
    private final Cloudinary cloudinary;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Transactional
    public MediaFileResponse uploadFile(MultipartFile file, User owner) {
        validateFile(file);

        String contentType = file.getContentType();
        String type = determineMediaType(contentType);
        String fileName = generateFileName(file.getOriginalFilename());

        // Upload to Cloudinary
        Map uploadResult;
        try {
            uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "resource_type", type.equals("VIDEO") ? "video" : "image",
                "public_id", fileName
            ));
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload to Cloudinary", e);
        }
        String url = (String) uploadResult.get("secure_url");

        MediaFile mediaFile = MediaFile.builder()
                .fileName(fileName)
                .originalName(StringUtils.cleanPath(file.getOriginalFilename()))
                .contentType(contentType)
                .size(file.getSize())
                .type(type)
                .path(url)
                .createdAt(Instant.now())
                .owner(owner)
                .build();

        mediaFile = mediaFileRepository.save(mediaFile);
        log.info("Uploaded file: {} for user: {} (Cloudinary)", fileName, owner.getUsername());

        return toResponse(mediaFile);
    }

    public List<MediaFileResponse> getMediaFiles(User owner, String type) {
        List<MediaFile> files;

        if (type == null || type.equalsIgnoreCase(AppConstants.MEDIA_TYPE_ALL)) {
            files = mediaFileRepository.findByOwnerOrderByCreatedAtDesc(owner);
        } else {
            files = mediaFileRepository.findByOwnerAndTypeOrderByCreatedAtDesc(owner, type.toUpperCase());
        }

        return files.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MediaFile getMediaFile(Long id) {
        return mediaFileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media file", "id", id));
    }

    public Resource loadFileAsResource(Long id) {
        MediaFile mediaFile = getMediaFile(id);

        try {
            Path filePath = Paths.get(mediaFile.getPath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found: " + mediaFile.getFileName());
            }
        } catch (IOException ex) {
            throw new ResourceNotFoundException("File not found: " + mediaFile.getFileName());
        }
    }

    @Transactional
    public void deleteFile(Long id, User owner) {
        MediaFile mediaFile = getMediaFile(id);

        if (!mediaFile.getOwner().getId().equals(owner.getId())) {
            throw new ForbiddenException("You don't have permission to delete this file");
        }

        try {
            Files.deleteIfExists(Paths.get(mediaFile.getPath()));
        } catch (IOException ex) {
            log.error("Failed to delete file from disk: {}", mediaFile.getPath(), ex);
        }

        mediaFileRepository.delete(mediaFile);
        log.info("Deleted file: {} for user: {}", mediaFile.getFileName(), owner.getUsername());
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        if (file.getSize() > AppConstants.MAX_FILE_SIZE) {
            throw new BadRequestException("File too large (max 100MB)");
        }
    }

    private String determineMediaType(String contentType) {
        if (contentType != null && contentType.startsWith("video")) {
            return AppConstants.MEDIA_TYPE_VIDEO;
        }
        return AppConstants.MEDIA_TYPE_PHOTO;
    }

    private String generateFileName(String originalFilename) {
        String ext = "";
        if (originalFilename != null) {
            int idx = originalFilename.lastIndexOf('.');
            if (idx >= 0) {
                ext = originalFilename.substring(idx);
            }
        }
        return UUID.randomUUID() + ext;
    }

    private Path saveFileToDisk(MultipartFile file, String fileName) {
        try {
            Path dir = Paths.get(uploadDir);
            Files.createDirectories(dir);
            Path path = dir.resolve(fileName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return path;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file", ex);
        }
    }

    private MediaFileResponse toResponse(MediaFile mediaFile) {
        return MediaFileResponse.builder()
                .id(mediaFile.getId())
                .fileName(mediaFile.getFileName())
                .originalName(mediaFile.getOriginalName())
                .contentType(mediaFile.getContentType())
                .size(mediaFile.getSize())
                .type(mediaFile.getType())
                .createdAt(mediaFile.getCreatedAt())
                .downloadUrl("/api/media/" + mediaFile.getId() + "/download")
                .build();
    }
}
