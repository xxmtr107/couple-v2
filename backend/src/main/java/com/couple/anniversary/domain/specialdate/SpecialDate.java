package com.couple.anniversary.domain.specialdate;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "special_dates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialDate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "couple_id", nullable = false)
    private Long coupleId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Instant date;

    @Column(nullable = false)
    private String type; // BIRTHDAY, ANNIVERSARY, CUSTOM

    @Column(name = "notify_enabled")
    private boolean notifyEnabled;
}
