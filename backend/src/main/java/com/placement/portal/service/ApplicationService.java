package com.placement.portal.service;

import com.placement.portal.dto.ApplicationRequestDto;
import com.placement.portal.dto.AtsMatchResultDto;
import com.placement.portal.dto.EligibilityResultDto;
import com.placement.portal.dto.StatusUpdateRequestDto;
import com.placement.portal.model.Application;
import com.placement.portal.model.ApplicationStatus;
import com.placement.portal.model.PlacementDrive;
import com.placement.portal.model.StudentProfile;
import com.placement.portal.repository.ApplicationRepository;
import com.placement.portal.repository.PlacementDriveRepository;
import com.placement.portal.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentProfileRepository studentRepository;
    private final PlacementDriveRepository driveRepository;
    private final SmartEligibilityService eligibilityService;
    private final SmartAtsService atsService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              StudentProfileRepository studentRepository,
                              PlacementDriveRepository driveRepository,
                              SmartEligibilityService eligibilityService,
                              SmartAtsService atsService) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.driveRepository = driveRepository;
        this.eligibilityService = eligibilityService;
        this.atsService = atsService;
    }

    @Transactional
    public Application apply(ApplicationRequestDto dto) {
        StudentProfile student = studentRepository.findById(dto.getStudentProfileId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + dto.getStudentProfileId()));

        PlacementDrive drive = driveRepository.findById(dto.getDriveId())
                .orElseThrow(() -> new RuntimeException("Placement drive not found with id: " + dto.getDriveId()));

        Optional<Application> existing = applicationRepository.findByStudentIdAndDriveId(student.getId(), drive.getId());
        if (existing.isPresent()) {
            throw new IllegalStateException("Student has already applied to this drive.");
        }

        // Run Smart Eligibility Rule Engine
        EligibilityResultDto eligibility = eligibilityService.checkEligibility(student, drive);
        if (!eligibility.isEligible()) {
            String reasons = String.join("; ", eligibility.getReasons());
            throw new IllegalArgumentException("Student does not meet eligibility criteria: " + reasons);
        }

        // Run Smart ATS Analyzer for resume/skills match score
        AtsMatchResultDto atsResult = atsService.analyzeMatch(student, drive);

        Application application = new Application();
        application.setStudent(student);
        application.setDrive(drive);
        application.setAppliedAt(LocalDateTime.now());
        application.setStatus(ApplicationStatus.APPLIED);
        application.setAtsScore(atsResult.getMatchPercentage());
        application.setRemarks("Application submitted successfully. Initial ATS Score: " + atsResult.getMatchPercentage() + "% (" + atsResult.getReadinessLevel() + ")");

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByStudent(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    public List<Application> getApplicationsByDrive(Long driveId) {
        return applicationRepository.findByDriveId(driveId);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Optional<Application> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }

    @Transactional
    public Application updateStatus(Long applicationId, StatusUpdateRequestDto dto) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        if (dto.getStatus() != null) {
            application.setStatus(dto.getStatus());
        }
        if (dto.getRemarks() != null) {
            application.setRemarks(dto.getRemarks());
        }
        if (dto.getInterviewDate() != null) {
            application.setInterviewDate(dto.getInterviewDate());
        }
        if (dto.getInterviewVenueOrLink() != null) {
            application.setInterviewVenueOrLink(dto.getInterviewVenueOrLink());
        }
        if (dto.getOfferPackageLpa() != null) {
            application.setOfferPackageLpa(dto.getOfferPackageLpa());
        }

        // If offer extended, update student profile placed status
        if (dto.getStatus() == ApplicationStatus.OFFERED) {
            StudentProfile student = application.getStudent();
            student.setPlaced(true);
            student.setPlacedCompany(application.getDrive().getCompany().getName());
            Double finalPackage = dto.getOfferPackageLpa() != null ? dto.getOfferPackageLpa() : application.getDrive().getPackageLpa();
            student.setPackageLpa(finalPackage);
            studentRepository.save(student);
        }

        return applicationRepository.save(application);
    }
}
