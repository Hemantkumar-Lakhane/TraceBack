package com.traceback.api.controller;

import com.traceback.api.model.MatchRecord;
import com.traceback.api.model.User;
import com.traceback.api.repository.MatchRecordRepository;
import com.traceback.api.repository.UserRepository;
import com.traceback.api.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchRecordRepository matchRecordRepository;
    private final UserRepository userRepository;
    private final MatchingService matchingService;

    @Autowired
    public MatchController(MatchRecordRepository matchRecordRepository,
                           UserRepository userRepository,
                           MatchingService matchingService) {
        this.matchRecordRepository = matchRecordRepository;
        this.userRepository = userRepository;
        this.matchingService = matchingService;
    }

    @GetMapping("/my-matches")
    public ResponseEntity<List<MatchRecord>> getMyMatches(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<MatchRecord> matches = matchRecordRepository.findByLostReportUserIdOrFoundReportUserId(user.getId(),
                user.getId());
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/by-report")
    public ResponseEntity<List<MatchRecord>> getMatchesByReport(
            @RequestParam(required = false) Long lostReportId,
            @RequestParam(required = false) Long foundReportId) {
        if (lostReportId != null) {
            return ResponseEntity.ok(matchRecordRepository.findByLostReportId(lostReportId));
        }
        if (foundReportId != null) {
            return ResponseEntity.ok(matchRecordRepository.findByFoundReportId(foundReportId));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/reevaluate")
    public ResponseEntity<Map<String, Object>> reevaluateMatches() {
        int newMatches = matchingService.reevaluateAllReports();
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Multi-factor correlation scan executed successfully",
                "newMatchesCreated", newMatches
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchRecord> getMatch(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        MatchRecord match = matchRecordRepository.findById(id).orElse(null);
        if (match == null) {
            return ResponseEntity.notFound().build();
        }

        // Check authorization
        boolean isOwner = match.getLostReport().getUser().getId().equals(user.getId()) ||
                match.getFoundReport().getUser().getId().equals(user.getId()) ||
                user.getRole() == com.traceback.api.model.Role.ADMIN ||
                user.getRole() == com.traceback.api.model.Role.SECURITY;

        if (!isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(match);
    }
}
