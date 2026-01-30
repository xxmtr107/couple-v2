package com.couple.anniversary.domain.media.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MediaService {

    private final MediaFileRepository mediaFileRepository;
    private final Cloudinary cloudinary;

    /**
     * Tải file lên Cloudinary và lưu thông tin vào Database
     */
    @Transactional
    public MediaFileResponse uploadFile(MultipartFile file, User owner) {
        validateFile(file);

        try {
            String contentType = file.getContentType();
            String type = determineMediaType(contentType);

            // 1. Upload lên Cloudinary
            // Anh dùng "auto" để Cloudinary tự lo phần định dạng video/image nhé
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "resource_type", "auto",
                    "folder", "anniversary/media"));

            String url = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            // 2. Lưu thông tin vào DB
            MediaFile mediaFile = MediaFile.builder()
                    .fileName(publicId) // Lưu publicId để sau này còn tìm mà xóa bé nhé
                    .originalName(StringUtils.cleanPath(file.getOriginalFilename()))
                    .contentType(contentType)
                    .size(file.getSize())
                    .type(type)
                    .path(url)
                    .createdAt(Instant.now())
                    .owner(owner)
                    .build();

            mediaFile = mediaFileRepository.save(mediaFile);
            log.info("Bé ơi, đã upload thành công file: {} cho user: {}", publicId, owner.getUsername());

            return toResponse(mediaFile);
        } catch (IOException e) {
            log.error("Lỗi upload Cloudinary: ", e);
            throw new RuntimeException("Tiểu muội ơi, hệ thống không tải file lên được rồi!");
        }
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

    public org.springframework.core.io.Resource loadFileAsResource(Long id) {
        MediaFile mediaFile = getMediaFile(id);
        try {
            // Nếu path là URL Cloudinary thì trả về resource từ URL
            java.net.URL url = new java.net.URL(mediaFile.getPath());
            return new org.springframework.core.io.UrlResource(url);
        } catch (Exception ex) {
            throw new ResourceNotFoundException("File not found: " + mediaFile.getFileName());
        }
    }

    /**
     * Xóa file trên Cloudinary và trong Database
     */
    @Transactional
    public void deleteFile(Long id, User owner) {
        MediaFile mediaFile = getMediaFile(id);

        if (!mediaFile.getOwner().getId().equals(owner.getId())) {
            throw new ForbiddenException("Bé không có quyền xóa file này đâu nhen!");
        }

        try {
            // Xác định resource_type để Cloudinary biết đường mà xóa
            String resourceType = mediaFile.getType().equals(AppConstants.MEDIA_TYPE_VIDEO) ? "video" : "image";

            // Xóa trên Cloudinary
            cloudinary.uploader().destroy(mediaFile.getFileName(), ObjectUtils.asMap("resource_type", resourceType));

            // Xóa trong DB
            mediaFileRepository.delete(mediaFile);
            log.info("Đã xóa file: {} xong rồi nhé bé!", mediaFile.getFileName());
        } catch (IOException ex) {
            log.error("Lỗi khi xóa file trên Cloudinary", ex);
            throw new RuntimeException("Huhu, không xóa được file trên Cloudinary rồi bé ơi");
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File trống rỗng nè bé ơi!");
        }
        // Giả sử AppConstants.MAX_FILE_SIZE của bé là khoảng 100MB
        if (file.getSize() > AppConstants.MAX_FILE_SIZE) {
            throw new BadRequestException("File nặng quá, bé chọn cái nào nhẹ hơn 100MB nhé!");
        }
    }

    private String determineMediaType(String contentType) {
        if (contentType != null && contentType.startsWith("video")) {
            return AppConstants.MEDIA_TYPE_VIDEO;
        }
        return AppConstants.MEDIA_TYPE_PHOTO;
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
                // Link trực tiếp từ Cloudinary luôn, không cần download qua server mình nữa
                .downloadUrl(mediaFile.getPath())
                .caption(mediaFile.getCaption())
                .tags(mediaFile.getTags())
                .mediaDate(mediaFile.getMediaDate())
                .build();
    }

    /**
     * Pagination: Lấy media theo couple với phân trang
     */
    public Page<MediaFileResponse> getMediaByCoupleId(Long coupleId, String type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MediaFile> mediaPage;
        if (type == null || type.equalsIgnoreCase(AppConstants.MEDIA_TYPE_ALL)) {
            mediaPage = mediaFileRepository.findByCoupleIdOrderByMediaDateDesc(coupleId, pageable);
        } else {
            mediaPage = mediaFileRepository.findByCoupleIdAndTypeOrderByMediaDateDesc(coupleId, type.toUpperCase(),
                    pageable);
        }
        return mediaPage.map(this::toResponse);
    }

    /**
     * On This Day: Lấy ảnh của ngày này các năm trước
     */
    public List<MediaFileResponse> getOnThisDay(Long coupleId) {
        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        int month = today.getMonthValue();
        int day = today.getDayOfMonth();
        int currentYear = today.getYear();

        List<MediaFile> files = mediaFileRepository.findOnThisDay(coupleId, month, day, currentYear);
        return files.stream().map(this::toResponse).collect(Collectors.toList());
    }
}