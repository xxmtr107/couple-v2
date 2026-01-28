package com.couple.anniversary.domain.media.controller;

import com.couple.anniversary.common.dto.ApiResponse;
import com.couple.anniversary.domain.media.dto.MediaFileResponse;
import com.couple.anniversary.domain.media.entity.MediaFile;
import com.couple.anniversary.domain.media.service.MediaService;
import com.couple.anniversary.domain.user.entity.User;
import com.couple.anniversary.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;
    private final UserService userService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<MediaFileResponse>> upload(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {

        User owner = userService.findByUsername(userDetails.getUsername());
        MediaFileResponse response = mediaService.uploadFile(file, owner);

        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MediaFileResponse>>> list(
            @RequestParam(name = "type", required = false) String type,
            @AuthenticationPrincipal UserDetails userDetails) {

        User owner = userService.findByUsername(userDetails.getUsername());
        List<MediaFileResponse> files = mediaService.getMediaFiles(owner, type);

        return ResponseEntity.ok(ApiResponse.success(files));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        MediaFile mediaFile = mediaService.getMediaFile(id);
        Resource resource = mediaService.loadFileAsResource(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mediaFile.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + mediaFile.getOriginalName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User owner = userService.findByUsername(userDetails.getUsername());
        mediaService.deleteFile(id, owner);

        return ResponseEntity.ok(ApiResponse.success("File deleted successfully"));
    }
}
