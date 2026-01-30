package com.couple.anniversary.domain.couple.controller;

import com.couple.anniversary.common.dto.ApiResponse;
import com.couple.anniversary.domain.couple.dto.CoupleRequestResponse;
import com.couple.anniversary.domain.couple.dto.CoupleResponse;
import com.couple.anniversary.domain.couple.dto.SendCoupleRequestDto;
import com.couple.anniversary.domain.couple.entity.Couple;
import com.couple.anniversary.domain.couple.entity.CoupleRequest;
import com.couple.anniversary.domain.couple.service.CoupleService;
import com.couple.anniversary.domain.user.entity.User;
import com.couple.anniversary.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/couple")
@RequiredArgsConstructor
@Tag(name = "Couple", description = "API endpoints for couple management")
@SecurityRequirement(name = "bearerAuth")
public class CoupleController {

    private final CoupleService coupleService;
    private final UserService userService;

    @Operation(summary = "Send couple request", description = "Send a couple request to another user by invite code")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Request sent successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request")
    })
    @PostMapping("/request")
    public ResponseEntity<ApiResponse<CoupleRequestResponse>> sendRequest(
            @Valid @RequestBody SendCoupleRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User fromUser = userService.findByUsername(userDetails.getUsername());
        CoupleRequest coupleRequest = coupleService.sendCoupleRequestByInviteCode(fromUser.getId(),
                request.getInviteCode());
        return ResponseEntity
                .ok(ApiResponse.success("Request sent successfully", coupleService.toRequestResponse(coupleRequest)));
    }

    @Operation(summary = "Get pending requests", description = "Get all pending couple requests for the current user")
    @GetMapping("/requests/pending")
    public ResponseEntity<ApiResponse<List<CoupleRequestResponse>>> getPendingRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        List<CoupleRequestResponse> requests = coupleService.getPendingRequestsForUser(user.getId())
                .stream()
                .map(coupleService::toRequestResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @Operation(summary = "Get my sent request", description = "Get the pending couple request that I sent")
    @GetMapping("/my-sent-request")
    public ResponseEntity<ApiResponse<CoupleRequestResponse>> getMySentRequest(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        CoupleRequest request = coupleService.getMySentPendingRequest(user.getId());
        if (request == null) {
            return ResponseEntity.ok(ApiResponse.success("No pending request", null));
        }
        return ResponseEntity.ok(ApiResponse.success(coupleService.toRequestResponse(request)));
    }

    @Operation(summary = "Cancel sent request", description = "Cancel a couple request that I sent")
    @DeleteMapping("/request/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        coupleService.cancelCoupleRequest(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Request cancelled successfully", null));
    }

    @Operation(summary = "Accept couple request", description = "Accept a pending couple request")
    @PostMapping("/request/{id}/accept")
    public ResponseEntity<ApiResponse<CoupleResponse>> acceptRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        Couple couple = coupleService.acceptCoupleRequest(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Request accepted", coupleService.toCoupleResponse(couple)));
    }

    @Operation(summary = "Reject couple request", description = "Reject a pending couple request")
    @PostMapping("/request/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        coupleService.rejectCoupleRequest(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Request rejected", null));
    }

    @Operation(summary = "Get my couple", description = "Get current couple info")
    @GetMapping
    public ResponseEntity<ApiResponse<CoupleResponse>> getMyCouple(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        Couple couple = coupleService.findCoupleByUser(user.getId()).orElse(null);
        if (couple == null) {
            return ResponseEntity.ok(ApiResponse.success("Not in a couple", null));
        }
        return ResponseEntity.ok(ApiResponse.success(coupleService.toCoupleResponse(couple)));
    }

    @Operation(summary = "Breakup", description = "End the couple relationship")
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> breakup(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        coupleService.breakup(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Breakup successful", null));
    }
}
