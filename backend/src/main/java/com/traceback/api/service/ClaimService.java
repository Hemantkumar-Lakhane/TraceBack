package com.traceback.api.service;

import com.traceback.api.model.*;
import com.traceback.api.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final MatchRecordRepository matchRecordRepository;
    private final FoundReportRepository foundReportRepository;
    private final FileStorageService fileStorageService;
    private final NotificationRepository notificationRepository;

    public ClaimService(ClaimRepository claimRepository,
                        MatchRecordRepository matchRecordRepository,
                        FoundReportRepository foundReportRepository,
                        FileStorageService fileStorageService,
                        NotificationRepository notificationRepository) {
        this.claimRepository = claimRepository;
        this.matchRecordRepository = matchRecordRepository;
        this.foundReportRepository = foundReportRepository;
        this.fileStorageService = fileStorageService;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Claim submitClaim(Long matchId, User claimant, String verificationData,
                            LocalDate pickupDate, LocalTime pickupTime, MultipartFile proofFile) {
        MatchRecord matchRecord = matchRecordRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match record not found with ID: " + matchId));

        String proofUrl = null;
        if (proofFile != null && !proofFile.isEmpty()) {
            proofUrl = fileStorageService.storeFile(proofFile);
        }

        Claim claim = new Claim();
        claim.setMatchRecord(matchRecord);
        claim.setClaimant(claimant);
        claim.setVerificationData(verificationData);
        claim.setProofFileUrl(proofUrl);
        claim.setPickupDate(pickupDate);
        claim.setPickupTime(pickupTime);
        claim.setStatus(ClaimStatus.PENDING);

        // Update FoundReport status to CLAIM_REQUESTED
        FoundReport foundReport = matchRecord.getFoundReport();
        if (foundReport != null) {
            foundReport.setStatus(FoundReportStatus.CLAIM_REQUESTED);
            foundReportRepository.save(foundReport);
        }

        Claim savedClaim = claimRepository.save(claim);

        // Notify claimant
        Notification notif = new Notification();
        notif.setUser(claimant);
        notif.setType("CLAIM");
        notif.setMessage("Your claim #" + savedClaim.getId() + " for " + matchRecord.getLostReport().getItem().getName() + " has been submitted for Security review.");
        notif.setReferenceId(savedClaim.getId());
        notificationRepository.save(notif);

        return savedClaim;
    }

    public List<Claim> getPendingClaims() {
        return claimRepository.findByStatus(ClaimStatus.PENDING);
    }

    public List<Claim> getMyClaims(User user) {
        return claimRepository.findByClaimantId(user.getId());
    }

    public Claim getClaimById(Long id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found with ID: " + id));
    }

    @Transactional
    public Claim updateClaimStatus(Long claimId, ClaimStatus newStatus, User reviewer) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found with ID: " + claimId));

        claim.setStatus(newStatus);
        claim.setReviewedAt(LocalDateTime.now());

        MatchRecord matchRecord = claim.getMatchRecord();
        FoundReport foundReport = matchRecord.getFoundReport();

        if (newStatus == ClaimStatus.APPROVED) {
            // Atomic transaction per specification:
            // 1. Claim status = APPROVED
            // 2. FoundReport status = RETURNED
            // 3. MatchRecord status = CLOSED
            if (foundReport != null) {
                foundReport.setStatus(FoundReportStatus.RETURNED);
                foundReportRepository.save(foundReport);
            }
            matchRecord.setStatus(MatchStatus.CLOSED);
            matchRecordRepository.save(matchRecord);

            // Notify claimant
            Notification notif = new Notification();
            notif.setUser(claim.getClaimant());
            notif.setType("CLAIM");
            notif.setMessage("Congratulations! Your claim for " + matchRecord.getLostReport().getItem().getName() + " has been APPROVED. You may pick up your item at Central Security Desk.");
            notif.setReferenceId(claim.getId());
            notificationRepository.save(notif);
        } else if (newStatus == ClaimStatus.REJECTED) {
            // Reset found report status to MATCHED or OPEN
            if (foundReport != null) {
                foundReport.setStatus(FoundReportStatus.MATCHED);
                foundReportRepository.save(foundReport);
            }

            // Notify claimant of rejection
            Notification notif = new Notification();
            notif.setUser(claim.getClaimant());
            notif.setType("CLAIM");
            notif.setMessage("Your claim for " + matchRecord.getLostReport().getItem().getName() + " could not be verified by Security.");
            notif.setReferenceId(claim.getId());
            notificationRepository.save(notif);
        }

        return claimRepository.save(claim);
    }
}
