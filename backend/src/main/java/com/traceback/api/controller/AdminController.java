package com.traceback.api.controller;

import com.traceback.api.model.Role;
import com.traceback.api.model.User;
import com.traceback.api.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
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

    @PutMapping("/users/{id}/role")
    @Operation(summary = "Update user role (Admin only)")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String roleStr = body.get("role");
        if (roleStr == null) return ResponseEntity.badRequest().body(Map.of("message", "role is required"));
        Role newRole = Role.valueOf(roleStr.toUpperCase());
        User updated = adminService.updateUserRole(id, newRole);
        return ResponseEntity.ok(updated);
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
