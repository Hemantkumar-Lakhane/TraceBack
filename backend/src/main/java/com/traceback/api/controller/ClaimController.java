package com.traceback.api.controller;

import com.traceback.api.model.Claim;
import com.traceback.api.model.ClaimStatus;
import com.traceback.api.model.User;
import com.traceback.api.repository.UserRepository;
import com.traceback.api.service.ClaimService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;
    private final UserRepository userRepository;

    public ClaimController(ClaimService claimService, UserRepository userRepository) {
        this.claimService = claimService;
        this.userRepository = userRepository;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    @Operation(summary = "Submit an ownership verification claim")
    public ResponseEntity<?> submitClaim(
            @RequestParam("match_id") Long matchId,
            @RequestParam(value = "verification_data", required = false) String verificationData,
            @RequestParam(value = "secret_marks", required = false) String secretMarks,
            @RequestParam(value = "serial_number", required = false) String serialNumber,
            @RequestParam(value = "lock_screen_hint", required = false) String lockScreenHint,
            @RequestParam(value = "item_name", required = false) String itemName,
            @RequestParam(value = "pickup_date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate pickupDate,
            @RequestParam(value = "pickup_time", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime pickupTime,
            @RequestParam(value = "proof_file", required = false) MultipartFile proofFile,
            Principal principal) {

        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();

        if (verificationData == null || verificationData.trim().isEmpty()) {
            StringBuilder sb = new StringBuilder();
            if (secretMarks != null && !secretMarks.isEmpty()) sb.append("Secret Marks: ").append(secretMarks).append("; ");
            if (serialNumber != null && !serialNumber.isEmpty()) sb.append("Serial: ").append(serialNumber).append("; ");
            if (lockScreenHint != null && !lockScreenHint.isEmpty()) sb.append("Wallpaper Hint: ").append(lockScreenHint).append("; ");
            verificationData = sb.length() > 0 ? sb.toString() : "Standard Student Ownership Claim";
        }

        Claim claim = claimService.submitClaim(matchId, user, verificationData, pickupDate, pickupTime, proofFile);
        return new ResponseEntity<>(claim, HttpStatus.CREATED);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('SECURITY') or hasRole('ADMIN')")
    @Operation(summary = "Get all pending claims for Security review")
    public ResponseEntity<List<Claim>> getPendingClaims() {
        return ResponseEntity.ok(claimService.getPendingClaims());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    @Operation(summary = "Get claims filed by the authenticated student")
    public ResponseEntity<List<Claim>> getMyClaims(Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(claimService.getMyClaims(user));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific claim details")
    public ResponseEntity<Claim> getClaimById(@PathVariable Long id) {
        return ResponseEntity.ok(claimService.getClaimById(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('SECURITY') or hasRole('ADMIN')")
    @Operation(summary = "Update claim status (Approve or Reject)")
    public ResponseEntity<?> updateClaimStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Principal principal) {

        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        User reviewer = userRepository.findByEmail(principal.getName()).orElseThrow();

        String statusStr = body.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "status is required"));
        }

        ClaimStatus newStatus = ClaimStatus.valueOf(statusStr.toUpperCase());
        Claim updated = claimService.updateClaimStatus(id, newStatus, reviewer);
        return ResponseEntity.ok(updated);
    }
}
