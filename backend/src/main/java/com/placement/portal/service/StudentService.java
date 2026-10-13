package com.placement.portal.service;

import com.placement.portal.model.PlacementDrive;
import com.placement.portal.model.StudentProfile;
import com.placement.portal.repository.PlacementDriveRepository;
import com.placement.portal.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentProfileRepository studentRepository;
    private final PlacementDriveRepository driveRepository;
    private final SmartEligibilityService eligibilityService;

    public StudentService(StudentProfileRepository studentRepository,
                          PlacementDriveRepository driveRepository,
                          SmartEligibilityService eligibilityService) {
        this.studentRepository = studentRepository;
        this.driveRepository = driveRepository;
        this.eligibilityService = eligibilityService;
    }

    public List<StudentProfile> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<StudentProfile> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Optional<StudentProfile> getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId);
    }

    public StudentProfile updateProfile(Long id, StudentProfile incoming) {
        return studentRepository.findById(id).map(existing -> {
            existing.setRollNumber(incoming.getRollNumber());
            existing.setDepartment(incoming.getDepartment());
            existing.setBatchYear(incoming.getBatchYear());
            existing.setCgpa(incoming.getCgpa());
            existing.setActiveBacklogs(incoming.getActiveBacklogs());
            existing.setSkills(incoming.getSkills());
            existing.setResumeHeadline(incoming.getResumeHeadline());
            existing.setGithubUrl(incoming.getGithubUrl());
            existing.setLinkedinUrl(incoming.getLinkedinUrl());
            existing.setResumeUrl(incoming.getResumeUrl());
            if (incoming.getPlaced() != null) {
                existing.setPlaced(incoming.getPlaced());
                existing.setPlacedCompany(incoming.getPlacedCompany());
                existing.setPackageLpa(incoming.getPackageLpa());
            }
            return studentRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Student profile not found with id: " + id));
    }

    public StudentProfile save(StudentProfile profile) {
        return studentRepository.save(profile);
    }
}
