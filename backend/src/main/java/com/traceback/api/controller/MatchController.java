package com.traceback.api.controller;

import com.traceback.api.model.MatchRecord;
import com.traceback.api.model.User;
import com.traceback.api.repository.MatchRecordRepository;
import com.traceback.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchRecordRepository matchRecordRepository;
    private final UserRepository userRepository;

    @Autowired
    public MatchController(MatchRecordRepository matchRecordRepository, UserRepository userRepository) {
        this.matchRecordRepository = matchRecordRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/my-matches")
    public ResponseEntity<List<MatchRecord>> getMyMatches(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<MatchRecord> matches = matchRecordRepository.findByLostReportUserIdOrFoundReportUserId(user.getId(), user.getId());
        return ResponseEntity.ok(matches);
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
                          match.getFoundReport().getUser().getId().equals(user.getId());

        if (!isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(match);
    }
}
