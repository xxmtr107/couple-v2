package com.couple.anniversary.domain.couple.repository;

import com.couple.anniversary.domain.couple.entity.Couple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoupleRepository extends JpaRepository<Couple, Long> {
    Couple findByUser1IdOrUser2Id(Long user1Id, Long user2Id);

    boolean existsByUser1IdOrUser2Id(Long user1Id, Long user2Id);
}
