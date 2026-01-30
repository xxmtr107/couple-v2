package com.couple.anniversary.domain.media.controller;

import com.couple.anniversary.common.dto.ApiResponse;
import com.couple.anniversary.domain.media.dto.MediaFileResponse;
import com.couple.anniversary.domain.media.entity.MediaFile;
import com.couple.anniversary.domain.media.service.MediaService;
import com.couple.anniversary.domain.user.entity.User;
import com.couple.anniversary.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
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
@Tag(name = "Media", description = "API endpoints for media file management")
@SecurityRequirement(name = "bearerAuth")
public class MediaController {

        private final MediaService mediaService;
        private final UserService userService;

        @Operation(summary = "Upload a media file", description = "Upload a new media file (image, video, etc.)")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "File uploaded successfully"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid file"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
        })
        @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ApiResponse<MediaFileResponse>> upload(
                        @Parameter(description = "File to upload") @RequestParam("file") MultipartFile file,
                        @AuthenticationPrincipal UserDetails userDetails) {

                User owner = userService.findByUsername(userDetails.getUsername());
                MediaFileResponse response = mediaService.uploadFile(file, owner);

                return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));
        }

        @Operation(summary = "List media files", description = "Get list of media files for the authenticated user")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Files retrieved successfully"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
        })
        @GetMapping
        public ResponseEntity<ApiResponse<List<MediaFileResponse>>> list(
                        @Parameter(description = "Filter by file type (image, video, etc.)") @RequestParam(name = "type", required = false) String type,
                        @AuthenticationPrincipal UserDetails userDetails) {

                User owner = userService.findByUsername(userDetails.getUsername());
                List<MediaFileResponse> files = mediaService.getMediaFiles(owner, type);

                return ResponseEntity.ok(ApiResponse.success(files));
        }

        @Operation(summary = "Download a media file", description = "Download a specific media file by ID (public access)")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "File downloaded successfully"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "File not found")
        })
        @GetMapping("/{id}/download")
        public ResponseEntity<Resource> download(
                        @Parameter(description = "Media file ID") @PathVariable Long id) {
                MediaFile mediaFile = mediaService.getMediaFile(id);
                Resource resource = mediaService.loadFileAsResource(id);

                return ResponseEntity.ok()
                                .contentType(MediaType.parseMediaType(mediaFile.getContentType()))
                                .header(HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=\"" + mediaFile.getOriginalName() + "\"")
                                .body(resource);
        }

        @Operation(summary = "Delete a media file", description = "Delete a specific media file by ID")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "File deleted successfully"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - not owner"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "File not found")
        })
        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> delete(
                        @Parameter(description = "Media file ID") @PathVariable Long id,
                        @AuthenticationPrincipal UserDetails userDetails) {

                User owner = userService.findByUsername(userDetails.getUsername());
                mediaService.deleteFile(id, owner);

                return ResponseEntity.ok(ApiResponse.success("File deleted successfully"));
        }

        @Operation(summary = "Get media with pagination", description = "Get media files for couple with pagination support")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Media retrieved successfully"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
        })
        @GetMapping("/paginated")
        public ResponseEntity<ApiResponse<Page<MediaFileResponse>>> getMediaPaginated(
                        @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
                        @Parameter(description = "Filter by type") @RequestParam(required = false) String type,
                        @AuthenticationPrincipal UserDetails userDetails) {

                User user = userService.findByUsername(userDetails.getUsername());
                if (user.getCoupleId() == null) {
                        return ResponseEntity.ok(ApiResponse.success("Not in a couple", Page.empty()));
                }
                Page<MediaFileResponse> mediaPage = mediaService.getMediaByCoupleId(user.getCoupleId(), type, page,
                                size);
                return ResponseEntity.ok(ApiResponse.success(mediaPage));
        }

        @Operation(summary = "On this day", description = "Get media files from previous years on the same day")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Media retrieved successfully"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
        })
        @GetMapping("/on-this-day")
        public ResponseEntity<ApiResponse<List<MediaFileResponse>>> getOnThisDay(
                        @AuthenticationPrincipal UserDetails userDetails) {

                User user = userService.findByUsername(userDetails.getUsername());
                if (user.getCoupleId() == null) {
                        return ResponseEntity.ok(ApiResponse.success("Not in a couple", List.of()));
                }
                List<MediaFileResponse> files = mediaService.getOnThisDay(user.getCoupleId());
                return ResponseEntity.ok(ApiResponse.success(files));
        }
}
