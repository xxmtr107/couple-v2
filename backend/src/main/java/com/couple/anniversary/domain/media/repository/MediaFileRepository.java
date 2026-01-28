package com.couple.anniversary.domain.media.repository;

import com.couple.anniversary.domain.media.entity.MediaFile;
import com.couple.anniversary.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {

    List<MediaFile> findByOwner(User owner);

    List<MediaFile> findByOwnerAndType(User owner, String type);

    List<MediaFile> findByOwnerOrderByCreatedAtDesc(User owner);

    List<MediaFile> findByOwnerAndTypeOrderByCreatedAtDesc(User owner, String type);

    Optional<MediaFile> findByIdAndOwner(Long id, User owner);
}
