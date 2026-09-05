package com.traceback.api.repository;

import com.traceback.api.model.FoundReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoundReportRepository extends JpaRepository<FoundReport, Long> {
    List<FoundReport> findByUserId(Long userId);
    List<FoundReport> findByStatus(com.traceback.api.model.FoundReportStatus status);
}
