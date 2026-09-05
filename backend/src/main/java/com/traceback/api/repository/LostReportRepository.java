package com.traceback.api.repository;

import com.traceback.api.model.LostReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostReportRepository extends JpaRepository<LostReport, Long> {
    List<LostReport> findByUserId(Long userId);
    List<LostReport> findByStatus(com.traceback.api.model.LostReportStatus status);
}
