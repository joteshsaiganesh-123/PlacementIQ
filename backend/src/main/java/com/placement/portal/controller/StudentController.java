package com.placement.portal.controller;

import com.placement.portal.dto.AtsMatchResultDto;
import com.placement.portal.dto.EligibilityResultDto;
import com.placement.portal.model.PlacementDrive;
import com.placement.portal.model.StudentProfile;
import com.placement.portal.service.PlacementDriveService;
import com.placement.portal.service.SmartAtsService;
import com.placement.portal.service.SmartEligibilityService;
import com.placement.portal.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;
    private final PlacementDriveService driveService;
    private final SmartEligibilityService eligibilityService;
    private final SmartAtsService atsService;

    public StudentController(StudentService studentService,
                             PlacementDriveService driveService,
                             SmartEligibilityService eligibilityService,
                             SmartAtsService atsService) {
        this.studentService = studentService;
        this.driveService = driveService;
        this.eligibilityService = eligibilityService;
        this.atsService = atsService;
    }

    @GetMapping
    public ResponseEntity<List<StudentProfile>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentProfile> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<StudentProfile> getStudentByUserId(@PathVariable Long userId) {
        return studentService.getStudentByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id, 
            @RequestBody StudentProfile updated,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        if (userRole != null && userRole.equals("RECRUITER")) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .body(java.util.Map.of("error", "Access denied: Recruiters cannot modify student profiles."));
        }
        try {
            return ResponseEntity.ok(studentService.updateProfile(id, updated));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/eligibility/{driveId}")
    public ResponseEntity<EligibilityResultDto> checkEligibility(@PathVariable Long id, @PathVariable Long driveId) {
        StudentProfile student = studentService.getStudentById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        PlacementDrive drive = driveService.getDriveById(driveId)
                .orElseThrow(() -> new RuntimeException("Drive not found"));

        return ResponseEntity.ok(eligibilityService.checkEligibility(student, drive));
    }

    @GetMapping("/{id}/ats-score/{driveId}")
    public ResponseEntity<AtsMatchResultDto> getAtsScore(@PathVariable Long id, @PathVariable Long driveId) {
        StudentProfile student = studentService.getStudentById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        PlacementDrive drive = driveService.getDriveById(driveId)
                .orElseThrow(() -> new RuntimeException("Drive not found"));

        return ResponseEntity.ok(atsService.analyzeMatch(student, drive));
    }
}
