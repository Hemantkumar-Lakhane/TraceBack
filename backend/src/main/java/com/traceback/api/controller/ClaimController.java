package com.traceback.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    @GetMapping("/pending")
    @PreAuthorize("hasRole('SECURITY')")
    public ResponseEntity<?> getPendingClaims() {
        return ResponseEntity.ok(Collections.emptyList());
    }
}
