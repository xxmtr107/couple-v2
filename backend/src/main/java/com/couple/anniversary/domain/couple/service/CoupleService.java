package com.couple.anniversary.domain.couple.service;

import com.couple.anniversary.domain.couple.entity.Couple;
import com.couple.anniversary.domain.couple.entity.CoupleRequest;
import com.couple.anniversary.domain.couple.repository.CoupleRepository;
import com.couple.anniversary.domain.couple.repository.CoupleRequestRepository;
import com.couple.anniversary.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CoupleService {
    private final CoupleRepository coupleRepository;
    private final CoupleRequestRepository coupleRequestRepository;

    public Optional<Couple> findCoupleByUser(Long userId) {
        return Optional.ofNullable(coupleRepository.findByUser1IdOrUser2Id(userId, userId));
    }

    public boolean isUserInCouple(Long userId) {
        return coupleRepository.existsByUser1IdOrUser2Id(userId, userId);
    }

    @Transactional
    public CoupleRequest sendCoupleRequest(Long fromUserId, Long toUserId) {
        if (coupleRequestRepository.existsByFromUserIdAndToUserIdAndStatus(fromUserId, toUserId, "PENDING")) {
            throw new IllegalStateException("Request already sent");
        }
        CoupleRequest request = CoupleRequest.builder()
                .fromUserId(fromUserId)
                .toUserId(toUserId)
                .status("PENDING")
                .build();
        return coupleRequestRepository.save(request);
    }

    public List<CoupleRequest> getPendingRequestsForUser(Long userId) {
        return coupleRequestRepository.findByToUserIdAndStatus(userId, "PENDING");
    }

    @Transactional
    public Couple acceptCoupleRequest(Long requestId) {
        CoupleRequest request = coupleRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        request.setStatus("ACCEPTED");
        coupleRequestRepository.save(request);
        Couple couple = Couple.builder()
                .user1Id(request.getFromUserId())
                .user2Id(request.getToUserId())
                .status("ACTIVE")
                .build();
        return coupleRepository.save(couple);
    }

    @Transactional
    public void rejectCoupleRequest(Long requestId) {
        CoupleRequest request = coupleRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        request.setStatus("REJECTED");
        coupleRequestRepository.save(request);
    }
}
