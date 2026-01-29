package com.couple.anniversary.domain.media.entity;

import com.couple.anniversary.domain.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "media_files", indexes = {
        @Index(name = "idx_media_owner", columnList = "owner_id"),
        @Index(name = "idx_media_type", columnList = "type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String originalName;

    private String contentType;

    private Long size;

    @Column(nullable = false)
    private String type; // PHOTO or VIDEO

    @Column(length = 1000)
    private String caption;

    @Column(name = "tags")
    private String tags; // comma-separated tags

    @Column(name = "media_date")
    private Instant mediaDate; // ngày chụp/quay, cho phép chỉnh tay

    @Column(name = "couple_id")
    private Long coupleId;

    @JsonIgnore
    @Column(nullable = false)
    private String path;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnore
    private User owner;

    @Transient
    public Long getOwnerId() {
        return owner != null ? owner.getId() : null;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
