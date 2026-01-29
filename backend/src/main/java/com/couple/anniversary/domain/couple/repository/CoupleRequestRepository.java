package com.couple.anniversary.domain.couple.repository;

import com.couple.anniversary.domain.couple.entity.CoupleRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoupleRequestRepository extends JpaRepository<CoupleRequest, Long> {
    List<CoupleRequest> findByToUserIdAndStatus(Long toUserId, String status);

    List<CoupleRequest> findByFromUserIdAndStatus(Long fromUserId, String status);

    boolean existsByFromUserIdAndToUserIdAndStatus(Long fromUserId, Long toUserId, String status);
}
