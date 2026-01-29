package com.couple.anniversary.domain.couple.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "couples")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Couple {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user1_id", nullable = false)
    private Long user1Id;

    @Column(name = "user2_id", nullable = false)
    private Long user2Id;

    @Column(name = "anniversary_date")
    private Instant anniversaryDate;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, INACTIVE

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
