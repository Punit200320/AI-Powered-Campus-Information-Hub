package com.campusai.repository;

import com.campusai.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, String> {

    @Query("SELECT r FROM Resource r WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(r.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(r.tags) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:category IS NULL OR :category = '' OR :category = 'All' OR r.category = :category) " +
           "AND (:department IS NULL OR :department = '' OR :department = 'All' OR r.department = :department) " +
           "AND (:semester IS NULL OR :semester = '' OR :semester = 'All' OR r.semester = :semester)")
    List<Resource> searchResources(
            @Param("query") String query,
            @Param("category") String category,
            @Param("department") String department,
            @Param("semester") String semester);

    List<Resource> findTop10ByOrderByDownloadsDesc();

    @Query("SELECT r FROM Resource r WHERE r.status IS NOT NULL ORDER BY r.uploadDate DESC")
    List<Resource> findDocumentsQueue();
}

