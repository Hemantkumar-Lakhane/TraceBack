package com.traceback.api.service;

import com.traceback.api.model.*;
import com.traceback.api.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final LostReportRepository lostReportRepository;
    private final FoundReportRepository foundReportRepository;
    private final MatchRecordRepository matchRecordRepository;
    private final ClaimRepository claimRepository;

    public AdminService(UserRepository userRepository,
                        LostReportRepository lostReportRepository,
                        FoundReportRepository foundReportRepository,
                        MatchRecordRepository matchRecordRepository,
                        ClaimRepository claimRepository) {
        this.userRepository = userRepository;
        this.lostReportRepository = lostReportRepository;
        this.foundReportRepository = foundReportRepository;
        this.matchRecordRepository = matchRecordRepository;
        this.claimRepository = claimRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        user.setRole(newRole);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteReport(Long reportId, String type) {
        if ("LOST".equalsIgnoreCase(type)) {
            lostReportRepository.deleteById(reportId);
        } else {
            foundReportRepository.deleteById(reportId);
        }
    }

    public Map<String, Object> getPlatformStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalUsers = userRepository.count();
        long totalLost = lostReportRepository.count();
        long totalFound = foundReportRepository.count();
        long totalMatches = matchRecordRepository.count();
        long totalClaims = claimRepository.count();

        stats.put("totalUsers", totalUsers);
        stats.put("totalLost", totalLost);
        stats.put("totalFound", totalFound);
        stats.put("totalMatches", totalMatches);
        stats.put("totalClaims", totalClaims);
        stats.put("returnRate", totalLost > 0 ? String.format("%.1f%%", ((double) totalMatches / totalLost) * 100) : "0.0%");
        return stats;
    }
}
