package com.traceback.api.controller;

import com.traceback.api.model.Role;
import com.traceback.api.model.User;
import com.traceback.api.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    @Operation(summary = "List all registered users (Admin only)")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users")
    @Operation(summary = "Provision a new staff or user account (Admin only)")
    public ResponseEntity<?> provisionUser(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String roleStr = body.getOrDefault("role", "SECURITY");
        String password = body.get("password");

        if (name == null || name.isBlank() || email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name and email are required"));
        }

        try {
            Role role = Role.valueOf(roleStr.toUpperCase());
            User created = adminService.provisionUser(name, email, role, password);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/role")
    @Operation(summary = "Update user role (Admin only)")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String roleStr = body.get("role");
        if (roleStr == null) return ResponseEntity.badRequest().body(Map.of("message", "role is required"));
        try {
            Role newRole = Role.valueOf(roleStr.toUpperCase());
            User updated = adminService.updateUserRole(id, newRole);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/status")
    @Operation(summary = "Update user account status (ACTIVE or SUSPENDED) (Admin only)")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "ACTIVE");
        try {
            User updated = adminService.updateUserStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user account (Admin only)")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/moderation")
    @Operation(summary = "List flagged reports in moderation queue (Admin only)")
    public ResponseEntity<?> getModerationQueue() {
        return ResponseEntity.ok(adminService.getModerationQueue());
    }

    @DeleteMapping("/reports/{id}")
    @Operation(summary = "Moderation delete report (Admin only)")
    public ResponseEntity<?> deleteReport(
            @PathVariable Long id,
            @RequestParam(value = "type", defaultValue = "LOST") String type) {
        adminService.deleteReport(id, type);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    @Operation(summary = "Platform health telemetry (Admin only)")
    public ResponseEntity<Map<String, Object>> getPlatformStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }
}
