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

    // New: find by coupleId
    List<MediaFile> findByCoupleIdOrderByMediaDateDesc(Long coupleId);

    // New: group by month/year (native query)
    @org.springframework.data.jpa.repository.Query(value = "SELECT YEAR(media_date) as year, MONTH(media_date) as month, COUNT(*) as count FROM media_files WHERE couple_id = :coupleId GROUP BY YEAR(media_date), MONTH(media_date) ORDER BY year DESC, month DESC", nativeQuery = true)
    List<Object[]> countMediaByMonthAndYear(Long coupleId);
}
