package com.traceback.api.service;

import com.traceback.api.dto.ReportRequest;
import com.traceback.api.model.*;
import com.traceback.api.repository.FoundReportRepository;
import com.traceback.api.repository.ItemRepository;
import com.traceback.api.repository.LostReportRepository;
import com.traceback.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {

    private final LostReportRepository lostReportRepository;
    private final FoundReportRepository foundReportRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final MatchingService matchingService;

    @Autowired
    public ReportService(LostReportRepository lostReportRepository,
                         FoundReportRepository foundReportRepository,
                         ItemRepository itemRepository,
                         UserRepository userRepository,
                         FileStorageService fileStorageService,
                         MatchingService matchingService) {
        this.lostReportRepository = lostReportRepository;
        this.foundReportRepository = foundReportRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.matchingService = matchingService;
    }

    @Transactional
    public LostReport createLostReport(ReportRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String imageUrl = null;
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            imageUrl = fileStorageService.storeFile(request.getImage());
        }

        try {
            Item item = new Item();
            item.setCategory(request.getCategory());
            item.setName(request.getName());
            item.setDescription(request.getDescription());
            item.setColor(request.getColor());
            item.setBrand(request.getBrand());
            item.setImageUrl(imageUrl);
            
            LostReport report = new LostReport();
            report.setItem(item);
            report.setUser(user);
            report.setLocation(request.getLocation());
            report.setDateLost(request.getDateLost());
            
            LostReport savedReport = lostReportRepository.save(report);
            matchingService.findMatchesForLostReport(savedReport);
            return savedReport;
        } catch (Exception e) {
            if (imageUrl != null) {
                fileStorageService.deleteFile(imageUrl);
            }
            throw e;
        }
    }

    @Transactional
    public FoundReport createFoundReport(ReportRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String imageUrl = null;
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            imageUrl = fileStorageService.storeFile(request.getImage());
        }

        try {
            Item item = new Item();
            item.setCategory(request.getCategory());
            item.setName(request.getName());
            item.setDescription(request.getDescription());
            item.setColor(request.getColor());
            item.setBrand(request.getBrand());
            item.setImageUrl(imageUrl);

            FoundReport report = new FoundReport();
            report.setItem(item);
            report.setUser(user);
            report.setLocation(request.getLocation());
            report.setDateFound(request.getDateFound());

            FoundReport savedReport = foundReportRepository.save(report);
            matchingService.findMatchesForFoundReport(savedReport);
            return savedReport;
        } catch (Exception e) {
            if (imageUrl != null) {
                fileStorageService.deleteFile(imageUrl);
            }
            throw e;
        }
    }

    public java.util.List<LostReport> getMyLostReports(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return lostReportRepository.findByUserId(user.getId());
    }

    public java.util.List<FoundReport> getMyFoundReports(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return foundReportRepository.findByUserId(user.getId());
    }

    public LostReport getLostReport(Long id) {
        return lostReportRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Report not found"));
    }

    public FoundReport getFoundReport(Long id) {
        return foundReportRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Report not found"));
    }

    public java.util.List<LostReport> getAllLostReports() {
        return lostReportRepository.findAll();
    }

    public java.util.List<FoundReport> getAllFoundReports() {
        return foundReportRepository.findAll();
    }
}
