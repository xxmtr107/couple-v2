package com.couple.anniversary.domain.media.repository;

import com.couple.anniversary.domain.media.entity.MediaFile;
import com.couple.anniversary.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // Pagination support
    Page<MediaFile> findByCoupleIdOrderByMediaDateDesc(Long coupleId, Pageable pageable);

    Page<MediaFile> findByCoupleIdAndTypeOrderByMediaDateDesc(Long coupleId, String type, Pageable pageable);

    // On this day: find media with same month and day from previous years
    @Query(value = "SELECT * FROM media_files WHERE couple_id = :coupleId " +
            "AND MONTH(media_date) = :month AND DAY(media_date) = :day " +
            "AND YEAR(media_date) < :currentYear " +
            "ORDER BY media_date DESC", nativeQuery = true)
    List<MediaFile> findOnThisDay(@Param("coupleId") Long coupleId,
            @Param("month") int month,
            @Param("day") int day,
            @Param("currentYear") int currentYear);

    // group by month/year (native query)
    @Query(value = "SELECT YEAR(media_date) as year, MONTH(media_date) as month, COUNT(*) as count FROM media_files WHERE couple_id = :coupleId GROUP BY YEAR(media_date), MONTH(media_date) ORDER BY year DESC, month DESC", nativeQuery = true)
    List<Object[]> countMediaByMonthAndYear(Long coupleId);
}
