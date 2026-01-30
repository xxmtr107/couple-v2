package com.couple.anniversary.domain.couple.service;

import com.couple.anniversary.common.exception.BadRequestException;
import com.couple.anniversary.common.exception.ForbiddenException;
import com.couple.anniversary.common.exception.ResourceNotFoundException;
import com.couple.anniversary.domain.couple.dto.CoupleRequestResponse;
import com.couple.anniversary.domain.couple.dto.CoupleResponse;
import com.couple.anniversary.domain.couple.entity.Couple;
import com.couple.anniversary.domain.couple.entity.CoupleRequest;
import com.couple.anniversary.domain.couple.repository.CoupleRepository;
import com.couple.anniversary.domain.couple.repository.CoupleRequestRepository;
import com.couple.anniversary.domain.user.entity.User;
import com.couple.anniversary.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CoupleService {
    private final CoupleRepository coupleRepository;
    private final CoupleRequestRepository coupleRequestRepository;
    private final UserRepository userRepository;

    public Optional<Couple> findCoupleByUser(Long userId) {
        return Optional.ofNullable(coupleRepository.findByUser1IdOrUser2Id(userId, userId));
    }

    public boolean isUserInCouple(Long userId) {
        return coupleRepository.existsByUser1IdOrUser2Id(userId, userId);
    }

    @Transactional
    public CoupleRequest sendCoupleRequest(Long fromUserId, Long toUserId) {
        if (fromUserId.equals(toUserId)) {
            throw new BadRequestException("Bé không thể gửi lời mời cho chính mình!");
        }
        if (isUserInCouple(fromUserId)) {
            throw new BadRequestException("Bé đã có couple rồi mà!");
        }
        if (isUserInCouple(toUserId)) {
            throw new BadRequestException("Người này đã có couple rồi!");
        }
        if (coupleRequestRepository.existsByFromUserIdAndToUserIdAndStatus(fromUserId, toUserId, "PENDING")) {
            throw new BadRequestException("Bé đã gửi lời mời rồi, chờ phản hồi nhé!");
        }
        // Cancel any existing pending request from this user
        coupleRequestRepository.findByFromUserIdAndStatus(fromUserId, "PENDING")
                .forEach(req -> {
                    req.setStatus("CANCELLED");
                    coupleRequestRepository.save(req);
                });

        CoupleRequest request = CoupleRequest.builder()
                .fromUserId(fromUserId)
                .toUserId(toUserId)
                .status("PENDING")
                .build();
        return coupleRequestRepository.save(request);
    }

    @Transactional
    public CoupleRequest sendCoupleRequestByInviteCode(Long fromUserId, String inviteCode) {
        User toUser = userRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new ResourceNotFoundException("User", "inviteCode", inviteCode));
        return sendCoupleRequest(fromUserId, toUser.getId());
    }

    public List<CoupleRequest> getPendingRequestsForUser(Long userId) {
        return coupleRequestRepository.findByToUserIdAndStatus(userId, "PENDING");
    }

    public CoupleRequest getMySentPendingRequest(Long userId) {
        List<CoupleRequest> requests = coupleRequestRepository.findByFromUserIdAndStatus(userId, "PENDING");
        return requests.isEmpty() ? null : requests.get(0);
    }

    @Transactional
    public void cancelCoupleRequest(Long requestId, Long userId) {
        CoupleRequest request = coupleRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("CoupleRequest", "id", requestId));
        if (!request.getFromUserId().equals(userId)) {
            throw new ForbiddenException("Bé không có quyền hủy lời mời này!");
        }
        if (!"PENDING".equals(request.getStatus())) {
            throw new BadRequestException("Lời mời này không còn ở trạng thái chờ!");
        }
        request.setStatus("CANCELLED");
        coupleRequestRepository.save(request);
    }

    @Transactional
    public Couple acceptCoupleRequest(Long requestId, Long userId) {
        CoupleRequest request = coupleRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("CoupleRequest", "id", requestId));
        if (!request.getToUserId().equals(userId)) {
            throw new ForbiddenException("Bé không có quyền chấp nhận lời mời này!");
        }
        if (!"PENDING".equals(request.getStatus())) {
            throw new BadRequestException("Lời mời này không còn ở trạng thái chờ!");
        }
        request.setStatus("ACCEPTED");
        coupleRequestRepository.save(request);

        Couple couple = Couple.builder()
                .user1Id(request.getFromUserId())
                .user2Id(request.getToUserId())
                .anniversaryDate(Instant.now())
                .status("ACTIVE")
                .build();
        couple = coupleRepository.save(couple);

        // Update coupleId for both users
        User user1 = userRepository.findById(request.getFromUserId()).orElseThrow();
        User user2 = userRepository.findById(request.getToUserId()).orElseThrow();
        user1.setCoupleId(couple.getId());
        user2.setCoupleId(couple.getId());
        userRepository.save(user1);
        userRepository.save(user2);

        return couple;
    }

    @Transactional
    public void rejectCoupleRequest(Long requestId, Long userId) {
        CoupleRequest request = coupleRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("CoupleRequest", "id", requestId));
        if (!request.getToUserId().equals(userId)) {
            throw new ForbiddenException("Bé không có quyền từ chối lời mời này!");
        }
        if (!"PENDING".equals(request.getStatus())) {
            throw new BadRequestException("Lời mời này không còn ở trạng thái chờ!");
        }
        request.setStatus("REJECTED");
        coupleRequestRepository.save(request);
    }

    @Transactional
    public void breakup(Long userId) {
        Couple couple = findCoupleByUser(userId)
                .orElseThrow(() -> new BadRequestException("Bé chưa có couple để chia tay!"));
        couple.setStatus("INACTIVE");
        coupleRepository.save(couple);

        // Clear coupleId for both users
        User user1 = userRepository.findById(couple.getUser1Id()).orElseThrow();
        User user2 = userRepository.findById(couple.getUser2Id()).orElseThrow();
        user1.setCoupleId(null);
        user2.setCoupleId(null);
        userRepository.save(user1);
        userRepository.save(user2);
    }

    public CoupleRequestResponse toRequestResponse(CoupleRequest request) {
        User fromUser = userRepository.findById(request.getFromUserId()).orElse(null);
        User toUser = userRepository.findById(request.getToUserId()).orElse(null);
        return CoupleRequestResponse.builder()
                .id(request.getId())
                .fromUserId(request.getFromUserId())
                .fromUserDisplayName(fromUser != null ? fromUser.getDisplayName() : null)
                .fromUserAvatar(fromUser != null ? fromUser.getAvatarUrl() : null)
                .toUserId(request.getToUserId())
                .toUserDisplayName(toUser != null ? toUser.getDisplayName() : null)
                .toUserAvatar(toUser != null ? toUser.getAvatarUrl() : null)
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .build();
    }

    public CoupleResponse toCoupleResponse(Couple couple) {
        User user1 = userRepository.findById(couple.getUser1Id()).orElse(null);
        User user2 = userRepository.findById(couple.getUser2Id()).orElse(null);
        long daysTogether = 0;
        if (couple.getAnniversaryDate() != null) {
            daysTogether = ChronoUnit.DAYS.between(couple.getAnniversaryDate(), Instant.now());
        }
        return CoupleResponse.builder()
                .id(couple.getId())
                .user1Id(couple.getUser1Id())
                .user1DisplayName(user1 != null ? user1.getDisplayName() : null)
                .user1Avatar(user1 != null ? user1.getAvatarUrl() : null)
                .user2Id(couple.getUser2Id())
                .user2DisplayName(user2 != null ? user2.getDisplayName() : null)
                .user2Avatar(user2 != null ? user2.getAvatarUrl() : null)
                .anniversaryDate(couple.getAnniversaryDate())
                .daysTogether(daysTogether)
                .status(couple.getStatus())
                .createdAt(couple.getCreatedAt())
                .build();
    }
}
