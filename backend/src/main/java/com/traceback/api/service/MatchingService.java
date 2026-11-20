package com.traceback.api.service;

import com.traceback.api.model.*;
import com.traceback.api.repository.ConversationRepository;
import com.traceback.api.repository.FoundReportRepository;
import com.traceback.api.repository.LostReportRepository;
import com.traceback.api.repository.MatchRecordRepository;
import com.traceback.api.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.*;

// Multi-Factor Intelligent Property Correlation & Automated Matching Engine
@Service
public class MatchingService {

    private static final Logger log = LoggerFactory.getLogger(MatchingService.class);

    private static final Set<String> STOP_WORDS = Set.of(
            "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "with", "by",
            "of", "from", "near", "next", "is", "it", "this", "that", "my", "lost", "found",
            "oz", "has", "have", "had", "small", "big", "one", "side", "top", "bottom");

    private final LostReportRepository lostReportRepository;
    private final FoundReportRepository foundReportRepository;
    private final MatchRecordRepository matchRecordRepository;
    private final ConversationRepository conversationRepository;
    private final NotificationRepository notificationRepository;

    public MatchingService(LostReportRepository lostReportRepository,
            FoundReportRepository foundReportRepository,
            MatchRecordRepository matchRecordRepository,
            ConversationRepository conversationRepository) {
        this(lostReportRepository, foundReportRepository, matchRecordRepository, conversationRepository, null);
    }

    @Autowired
    public MatchingService(LostReportRepository lostReportRepository,
            FoundReportRepository foundReportRepository,
            MatchRecordRepository matchRecordRepository,
            ConversationRepository conversationRepository,
            @Autowired(required = false) NotificationRepository notificationRepository) {
        this.lostReportRepository = lostReportRepository;
        this.foundReportRepository = foundReportRepository;
        this.matchRecordRepository = matchRecordRepository;
        this.conversationRepository = conversationRepository;
        this.notificationRepository = notificationRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("Matching Engine initialized. Executing automated correlation scan across open reports...");
        try {
            reevaluateAllReports();
        } catch (Exception e) {
            log.warn("Auto-reevaluation deferred: {}", e.getMessage());
        }
    }

    @Transactional
    public void findMatchesForLostReport(LostReport lostReport) {
        if (lostReport.getStatus() == LostReportStatus.CLOSED) {
            return;
        }

        List<FoundReport> candidates = foundReportRepository.findAll().stream()
                .filter(f -> f.getStatus() != FoundReportStatus.CLOSED && f.getStatus() != FoundReportStatus.RETURNED)
                .toList();

        for (FoundReport foundReport : candidates) {
            evaluateAndCreateMatch(lostReport, foundReport);
        }
    }

    @Transactional
    public void findMatchesForFoundReport(FoundReport foundReport) {
        if (foundReport.getStatus() == FoundReportStatus.CLOSED || foundReport.getStatus() == FoundReportStatus.RETURNED) {
            return;
        }

        List<LostReport> candidates = lostReportRepository.findAll().stream()
                .filter(l -> l.getStatus() != LostReportStatus.CLOSED)
                .toList();

        for (LostReport lostReport : candidates) {
            evaluateAndCreateMatch(lostReport, foundReport);
        }
    }

    @Transactional
    public int reevaluateAllReports() {
        List<LostReport> lostList = lostReportRepository.findAll().stream()
                .filter(l -> l.getStatus() != LostReportStatus.CLOSED)
                .toList();
        List<FoundReport> foundList = foundReportRepository.findAll().stream()
                .filter(f -> f.getStatus() != FoundReportStatus.CLOSED && f.getStatus() != FoundReportStatus.RETURNED)
                .toList();

        int createdCount = 0;
        for (LostReport lost : lostList) {
            for (FoundReport found : foundList) {
                if (evaluateAndCreateMatch(lost, found)) {
                    createdCount++;
                }
            }
        }
        log.info("Completed correlation scan. Newly generated matches: {}", createdCount);
        return createdCount;
    }

    @Transactional
    public boolean evaluateAndCreateMatch(LostReport lostReport, FoundReport foundReport) {
        int score = calculateScore(lostReport, foundReport);
        if (score >= 70) {
            if (matchRecordRepository.existsByLostReportIdAndFoundReportId(lostReport.getId(), foundReport.getId())) {
                log.debug("Match record already exists for lost_id={} and found_id={}", lostReport.getId(),
                        foundReport.getId());
                return false;
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

            // Transition status to MATCHED
            if (lostReport.getStatus() == LostReportStatus.OPEN) {
                lostReport.setStatus(LostReportStatus.MATCHED);
                lostReportRepository.save(lostReport);
            }
            if (foundReport.getStatus() == FoundReportStatus.OPEN) {
                foundReport.setStatus(FoundReportStatus.MATCHED);
                foundReportRepository.save(foundReport);
            }

            // Create notification alerts for participants
            try {
                if (notificationRepository != null) {
                    if (lostReport.getUser() != null) {
                        Notification n1 = new Notification();
                        n1.setUser(lostReport.getUser());
                        n1.setType("MATCH");
                        n1.setMessage("Automated Match (" + score + "%): Your lost item '" +
                                (lostReport.getItem() != null ? lostReport.getItem().getName() : "item") +
                                "' matches a reported found item! Verification chat channel is open.");
                        n1.setReferenceId(savedMatch.getId());
                        notificationRepository.save(n1);
                    }
                    if (foundReport.getUser() != null) {
                        Notification n2 = new Notification();
                        n2.setUser(foundReport.getUser());
                        n2.setType("MATCH");
                        n2.setMessage("Automated Match (" + score + "%): Your found report for '" +
                                (foundReport.getItem() != null ? foundReport.getItem().getName() : "item") +
                                "' has been matched with a student's lost item! Verification chat is now open.");
                        n2.setReferenceId(savedMatch.getId());
                        notificationRepository.save(n2);
                    }
                }
            } catch (Exception e) {
                log.warn("Notification dispatch skipped: {}", e.getMessage());
            }

            log.info("Successfully established MatchRecord #{} and Conversation between lost_id={} and found_id={} with score={}",
                    savedMatch.getId(), lostReport.getId(), foundReport.getId(), score);
            return true;
        }
        return false;
    }

    public int calculateScore(LostReport lostReport, FoundReport foundReport) {
        int score = 0;

        Item lostItem = lostReport.getItem();
        Item foundItem = foundReport.getItem();

        String lostText = buildSearchableText(lostItem);
        String foundText = buildSearchableText(foundItem);
        Set<String> lostTokens = extractKeywords(lostText);
        Set<String> foundTokens = extractKeywords(foundText);

        Set<String> commonTokens = new HashSet<>(lostTokens);
        commonTokens.retainAll(foundTokens);

        // 1. Category (40 points base, 20 points for OTHER fallback with keyword overlap)
        if (lostItem != null && foundItem != null && lostItem.getCategory() != null && foundItem.getCategory() != null) {
            String lCat = lostItem.getCategory().trim().toUpperCase();
            String fCat = foundItem.getCategory().trim().toUpperCase();

            if (lCat.equalsIgnoreCase(fCat)) {
                score += 40;
            } else if ((lCat.equals("OTHER") || fCat.equals("OTHER") || isCompatibleCategory(lCat, fCat)) && !commonTokens.isEmpty()) {
                score += 20;
            }
        }

        // 2. Location (30 points base, 20 points for multi-token keyword proximity)
        if (lostReport.getLocation() != null && foundReport.getLocation() != null) {
            String lostLoc = lostReport.getLocation().trim().toLowerCase();
            String foundLoc = foundReport.getLocation().trim().toLowerCase();
            if (lostLoc.equals(foundLoc)) {
                score += 30;
            } else {
                Set<String> lostLocTokens = extractKeywords(lostLoc);
                Set<String> foundLocTokens = extractKeywords(foundLoc);
                Set<String> commonLoc = new HashSet<>(lostLocTokens);
                commonLoc.retainAll(foundLocTokens);

                // Require at least 2 distinct location keywords with length >= 4 (e.g. "water" and "dispenser")
                long substantialMatches = commonLoc.stream().filter(t -> t.length() >= 4).count();
                if (substantialMatches >= 2) {
                    score += 20;
                }
            }
        }

        // 3. Date Proximity (30 points base - difference <= 2 days)
        if (lostReport.getDateLost() != null && foundReport.getDateFound() != null) {
            long daysDifference = Math
                    .abs(ChronoUnit.DAYS.between(lostReport.getDateLost(), foundReport.getDateFound()));
            if (daysDifference <= 2) {
                score += 30;
            }
        }

        // 4. Brand Match Bonus (up to 20 points)
        String lostBrand = (lostItem != null && lostItem.getBrand() != null) ? lostItem.getBrand().trim().toLowerCase() : "";
        String foundBrand = (foundItem != null && foundItem.getBrand() != null) ? foundItem.getBrand().trim().toLowerCase() : "";

        if (!lostBrand.isEmpty() && !foundBrand.isEmpty()) {
            if (lostBrand.equalsIgnoreCase(foundBrand) || lostBrand.contains(foundBrand) || foundBrand.contains(lostBrand)) {
                score += 20;
            }
        } else if (!lostBrand.isEmpty() && foundText.contains(lostBrand)) {
            score += 20;
        } else if (!foundBrand.isEmpty() && lostText.contains(foundBrand)) {
            score += 20;
        }

        // 5. Keyword Overlap Bonus (up to 25 points)
        if (commonTokens.size() >= 3) {
            score += 25;
        } else if (commonTokens.size() == 2) {
            score += 15;
        } else if (commonTokens.size() == 1 && (score < 40)) {
            score += 10;
        }

        return Math.min(score, 100);
    }

    private String buildSearchableText(Item item) {
        if (item == null) return "";
        StringBuilder sb = new StringBuilder();
        if (item.getName() != null) sb.append(item.getName()).append(" ");
        if (item.getDescription() != null) sb.append(item.getDescription()).append(" ");
        if (item.getColor() != null) sb.append(item.getColor()).append(" ");
        if (item.getBrand() != null) sb.append(item.getBrand()).append(" ");
        return sb.toString().toLowerCase();
    }

    private Set<String> extractKeywords(String text) {
        if (text == null || text.trim().isEmpty()) return Collections.emptySet();
        String cleaned = text.replaceAll("[^a-zA-Z0-9\\s]", " ").toLowerCase();
        String[] parts = cleaned.split("\\s+");
        Set<String> tokens = new HashSet<>();
        for (String p : parts) {
            String trimmed = p.trim();
            if (trimmed.length() >= 3 && !STOP_WORDS.contains(trimmed)) {
                tokens.add(trimmed);
            }
        }
        return tokens;
    }

    private boolean isCompatibleCategory(String cat1, String cat2) {
        if (cat1.contains("BAG") && cat2.contains("OTHER")) return true;
        if (cat2.contains("BAG") && cat1.contains("OTHER")) return true;
        if (cat1.contains("ELECTRONIC") && cat2.contains("OTHER")) return true;
        if (cat2.contains("ELECTRONIC") && cat1.contains("OTHER")) return true;
        return false;
    }
}
