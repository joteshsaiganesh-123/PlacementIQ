package com.placement.portal.controller;

import com.placement.portal.dto.ApplicationRequestDto;
import com.placement.portal.dto.StatusUpdateRequestDto;
import com.placement.portal.model.Application;
import com.placement.portal.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> apply(
            @RequestBody ApplicationRequestDto request,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        if (userRole != null && (userRole.equals("TPO_ADMIN") || userRole.equals("RECRUITER"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Faculty or Recruiters cannot submit student drive applications."));
        }
        try {
            Application application = applicationService.apply(request);
            return ResponseEntity.ok(application);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            Map<String, String> err = new HashMap<>();
            err.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(err);
        } catch (Exception ex) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Failed to submit application: " + ex.getMessage());
            return ResponseEntity.internalServerError().body(err);
        }
    }

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        return applicationService.getApplicationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Application>> getApplicationsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(applicationService.getApplicationsByStudent(studentId));
    }

    @GetMapping("/drive/{driveId}")
    public ResponseEntity<List<Application>> getApplicationsByDrive(@PathVariable Long driveId) {
        return ResponseEntity.ok(applicationService.getApplicationsByDrive(driveId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequestDto request,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        if (userRole != null && !userRole.equals("TPO_ADMIN") && !userRole.equals("RECRUITER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Only Recruiters or Faculty can update candidate recruitment status."));
        }
        try {
            Application updated = applicationService.updateStatus(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            Map<String, String> err = new HashMap<>();
            err.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(err);
        } catch (Exception ex) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Error updating application status: " + ex.getMessage());
            return ResponseEntity.internalServerError().body(err);
        }
    }
}
