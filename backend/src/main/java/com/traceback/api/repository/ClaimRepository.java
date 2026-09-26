package com.traceback.api.repository;

import com.traceback.api.model.Claim;
import com.traceback.api.model.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByStatus(ClaimStatus status);
    List<Claim> findByClaimantId(Long claimantId);
    List<Claim> findByMatchRecordId(Long matchRecordId);
}
