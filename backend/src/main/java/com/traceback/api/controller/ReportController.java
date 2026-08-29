package com.traceback.api.controller;

import com.traceback.api.dto.ReportRequest;
import com.traceback.api.model.FoundReport;
import com.traceback.api.model.LostReport;
import com.traceback.api.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/lost")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<LostReport> createLostReport(@ModelAttribute ReportRequest request, Principal principal) {
        LostReport report = reportService.createLostReport(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(report);
    }

    @PostMapping("/found")
    @PreAuthorize("hasAnyRole('STUDENT', 'SECURITY')")
    public ResponseEntity<FoundReport> createFoundReport(@ModelAttribute ReportRequest request, Principal principal) {
        FoundReport report = reportService.createFoundReport(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(report);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getReports(@RequestParam(required = false) String type) {
        if ("FOUND".equalsIgnoreCase(type)) {
            return ResponseEntity.ok(reportService.getAllFoundReports());
        }
        // Default to LOST if type is missing or something else
        return ResponseEntity.ok(reportService.getAllLostReports());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyReports(@RequestParam(required = false) String type, Principal principal) {
        if ("FOUND".equalsIgnoreCase(type)) {
            return ResponseEntity.ok(reportService.getMyFoundReports(principal.getName()));
        }
        return ResponseEntity.ok(reportService.getMyLostReports(principal.getName()));
    }

    @GetMapping("/lost/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LostReport> getLostReport(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getLostReport(id));
    }

    @GetMapping("/found/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FoundReport> getFoundReport(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getFoundReport(id));
    }
}
