package com.placement.portal.controller;

import com.placement.portal.model.PlacementDrive;
import com.placement.portal.service.PlacementDriveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drives")
public class PlacementDriveController {

    private final PlacementDriveService driveService;

    public PlacementDriveController(PlacementDriveService driveService) {
        this.driveService = driveService;
    }

    @GetMapping
    public ResponseEntity<List<PlacementDrive>> getAllDrives() {
        return ResponseEntity.ok(driveService.getAllDrives());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlacementDrive> getDriveById(@PathVariable Long id) {
        return driveService.getDriveById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PlacementDrive>> getDrivesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(driveService.getDrivesByStatus(status.toUpperCase()));
    }

    @PostMapping
    public ResponseEntity<?> createDrive(
            @RequestBody PlacementDrive drive,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        if (userRole != null && !userRole.equals("TPO_ADMIN") && !userRole.equals("RECRUITER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Only Faculty (TPO_ADMIN) or Recruiters can launch placement drives."));
        }
        return ResponseEntity.ok(driveService.createDrive(drive));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDrive(
            @PathVariable Long id,
            @RequestBody PlacementDrive drive,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        if (userRole != null && !userRole.equals("TPO_ADMIN") && !userRole.equals("RECRUITER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Only Faculty (TPO_ADMIN) or Recruiters can modify placement drives."));
        }
        try {
            return ResponseEntity.ok(driveService.updateDrive(id, drive));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDrive(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        if (userRole != null && !userRole.equals("TPO_ADMIN") && !userRole.equals("RECRUITER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Only Faculty (TPO_ADMIN) or Recruiters can delete placement drives."));
        }
        driveService.deleteDrive(id);
        return ResponseEntity.noContent().build();
    }
}
