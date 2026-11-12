package com.traceback.api.repository;

import com.traceback.api.model.Claim;
import com.traceback.api.model.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByStatus(ClaimStatus status);

    @Query("SELECT c FROM Claim c WHERE c.claimant.id = :claimantId")
    List<Claim> findByClaimantId(@Param("claimantId") Long claimantId);

    @Query("SELECT c FROM Claim c WHERE c.matchRecord.id = :matchRecordId")
    List<Claim> findByMatchRecordId(@Param("matchRecordId") Long matchRecordId);
}
