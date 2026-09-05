package com.traceback.api.service;

import com.traceback.api.model.*;
import com.traceback.api.repository.ConversationRepository;
import com.traceback.api.repository.FoundReportRepository;
import com.traceback.api.repository.LostReportRepository;
import com.traceback.api.repository.MatchRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class MatchingService {

    private static final Logger log = LoggerFactory.getLogger(MatchingService.class);

    private final LostReportRepository lostReportRepository;
    private final FoundReportRepository foundReportRepository;
    private final MatchRecordRepository matchRecordRepository;
    private final ConversationRepository conversationRepository;

    @Autowired
    public MatchingService(LostReportRepository lostReportRepository,
                           FoundReportRepository foundReportRepository,
                           MatchRecordRepository matchRecordRepository,
                           ConversationRepository conversationRepository) {
        this.lostReportRepository = lostReportRepository;
        this.foundReportRepository = foundReportRepository;
        this.matchRecordRepository = matchRecordRepository;
        this.conversationRepository = conversationRepository;
    }

    @Transactional
    public void findMatchesForLostReport(LostReport lostReport) {
        if (lostReport.getStatus() != LostReportStatus.OPEN) {
            return;
        }

        List<FoundReport> openFoundReports = foundReportRepository.findByStatus(FoundReportStatus.OPEN);
        for (FoundReport foundReport : openFoundReports) {
            evaluateAndCreateMatch(lostReport, foundReport);
        }
    }

    @Transactional
    public void findMatchesForFoundReport(FoundReport foundReport) {
        if (foundReport.getStatus() != FoundReportStatus.OPEN) {
            return;
        }

        List<LostReport> openLostReports = lostReportRepository.findByStatus(LostReportStatus.OPEN);
        for (LostReport lostReport : openLostReports) {
            evaluateAndCreateMatch(lostReport, foundReport);
        }
    }

    private void evaluateAndCreateMatch(LostReport lostReport, FoundReport foundReport) {
        int score = calculateScore(lostReport, foundReport);
        if (score >= 70) {
            if (matchRecordRepository.existsByLostReportIdAndFoundReportId(lostReport.getId(), foundReport.getId())) {
                log.debug("Duplicate match ignored for lost_id={} and found_id={}", lostReport.getId(), foundReport.getId());
                return;
            }

            MatchRecord matchRecord = new MatchRecord();
            matchRecord.setLostReport(lostReport);
            matchRecord.setFoundReport(foundReport);
            matchRecord.setScore(score);
            matchRecord.setStatus(MatchStatus.ACTIVE);
            
            MatchRecord savedMatch = matchRecordRepository.saveAndFlush(matchRecord);
            
            Conversation conversation = new Conversation();
            conversation.setMatchRecord(savedMatch);
            conversationRepository.saveAndFlush(conversation);
            
            log.info("Successfully created match between lost_id={} and found_id={} with score={}", lostReport.getId(), foundReport.getId(), score);
        }
    }

    public int calculateScore(LostReport lostReport, FoundReport foundReport) {
        int score = 0;

        Item lostItem = lostReport.getItem();
        Item foundItem = foundReport.getItem();

        // 1. Category (40 points) - Case-insensitive exact match
        if (lostItem.getCategory() != null && foundItem.getCategory() != null) {
            if (lostItem.getCategory().trim().equalsIgnoreCase(foundItem.getCategory().trim())) {
                score += 40;
            }
        }

        // 2. Location (30 points) - Normalize input (trim + lowercase) and exact equality
        if (lostReport.getLocation() != null && foundReport.getLocation() != null) {
            String lostLoc = lostReport.getLocation().trim().toLowerCase();
            String foundLoc = foundReport.getLocation().trim().toLowerCase();
            if (lostLoc.equals(foundLoc)) {
                score += 30;
            }
        }

        // 3. Date (30 points) - Absolute difference <= 2 days
        if (lostReport.getDateLost() != null && foundReport.getDateFound() != null) {
            long daysDifference = Math.abs(ChronoUnit.DAYS.between(lostReport.getDateLost(), foundReport.getDateFound()));
            if (daysDifference <= 2) {
                score += 30;
            }
        }

        return score;
    }
}
