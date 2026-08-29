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
import org.springframework.http.MediaType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import java.security.Principal;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping(value = "/lost", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Create a lost item report", description = "Submit a new lost item report with an optional image upload (JPG/PNG max 10MB)")
    public ResponseEntity<LostReport> createLostReport(@ModelAttribute ReportRequest request, Principal principal) {
        LostReport report = reportService.createLostReport(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(report);
    }

    @PostMapping(value = "/found", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('STUDENT', 'SECURITY')")
    @Operation(summary = "Create a found item report", description = "Submit a new found item report with an optional image upload (JPG/PNG max 10MB)")
    public ResponseEntity<FoundReport> createFoundReport(@ModelAttribute ReportRequest request, Principal principal) {
        FoundReport report = reportService.createFoundReport(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(report);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List all reports", description = "Retrieve a list of all reports with optional filtering")
    public ResponseEntity<?> getReports(
            @Parameter(description = "Report type: LOST or FOUND") @RequestParam(required = false) String type,
            @Parameter(description = "Category filter") @RequestParam(required = false) String category,
            @Parameter(description = "Location filter") @RequestParam(required = false) String location) {
        if ("FOUND".equalsIgnoreCase(type)) {
            return ResponseEntity.ok(reportService.getAllFoundReports());
        }
        // Default to LOST if type is missing or something else
        return ResponseEntity.ok(reportService.getAllLostReports());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get my reports", description = "List all reports created by the currently authenticated student")
    public ResponseEntity<?> getMyReports(@Parameter(description = "Report type: LOST or FOUND") @RequestParam(required = false) String type, Principal principal) {
        if ("FOUND".equalsIgnoreCase(type)) {
            return ResponseEntity.ok(reportService.getMyFoundReports(principal.getName()));
        }
        return ResponseEntity.ok(reportService.getMyLostReports(principal.getName()));
    }

    @GetMapping("/lost/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get a lost report by ID")
    public ResponseEntity<LostReport> getLostReport(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getLostReport(id));
    }

    @GetMapping("/found/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get a found report by ID")
    public ResponseEntity<FoundReport> getFoundReport(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getFoundReport(id));
    }
}
