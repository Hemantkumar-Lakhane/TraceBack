package com.traceback.api.repository;

import com.traceback.api.model.MatchRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRecordRepository extends JpaRepository<MatchRecord, Long> {
    List<MatchRecord> findByLostReportUserIdOrFoundReportUserId(Long lostUserId, Long foundUserId);
    boolean existsByLostReportIdAndFoundReportId(Long lostId, Long foundId);
}
