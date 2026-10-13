package com.placement.portal.service;

import com.placement.portal.model.Company;
import com.placement.portal.model.PlacementDrive;
import com.placement.portal.repository.CompanyRepository;
import com.placement.portal.repository.PlacementDriveRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlacementDriveService {

    private final PlacementDriveRepository driveRepository;
    private final CompanyRepository companyRepository;

    public PlacementDriveService(PlacementDriveRepository driveRepository, CompanyRepository companyRepository) {
        this.driveRepository = driveRepository;
        this.companyRepository = companyRepository;
    }

    public List<PlacementDrive> getAllDrives() {
        return driveRepository.findByOrderByDriveDateAsc();
    }

    public Optional<PlacementDrive> getDriveById(Long id) {
        return driveRepository.findById(id);
    }

    public List<PlacementDrive> getDrivesByStatus(String status) {
        return driveRepository.findByStatus(status);
    }

    public PlacementDrive createDrive(PlacementDrive drive) {
        if (drive.getCompany() != null && drive.getCompany().getId() != null) {
            Company company = companyRepository.findById(drive.getCompany().getId())
                    .orElseThrow(() -> new RuntimeException("Company not found with id: " + drive.getCompany().getId()));
            drive.setCompany(company);
        }
        if (drive.getStatus() == null) {
            drive.setStatus("ACTIVE");
        }
        return driveRepository.save(drive);
    }

    public PlacementDrive updateDrive(Long id, PlacementDrive incoming) {
        return driveRepository.findById(id).map(existing -> {
            existing.setJobTitle(incoming.getJobTitle());
            existing.setJobRole(incoming.getJobRole());
            existing.setJobDescription(incoming.getJobDescription());
            existing.setPackageLpa(incoming.getPackageLpa());
            existing.setMinCgpa(incoming.getMinCgpa());
            existing.setMaxBacklogsAllowed(incoming.getMaxBacklogsAllowed());
            existing.setEligibleDepartments(incoming.getEligibleDepartments());
            existing.setEligibleBatchYear(incoming.getEligibleBatchYear());
            existing.setRequiredSkills(incoming.getRequiredSkills());
            existing.setDriveDate(incoming.getDriveDate());
            existing.setApplicationDeadline(incoming.getApplicationDeadline());
            existing.setStatus(incoming.getStatus());
            existing.setTotalOpenings(incoming.getTotalOpenings());
            existing.setWorkLocation(incoming.getWorkLocation());
            return driveRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Placement drive not found with id: " + id));
    }

    public void deleteDrive(Long id) {
        driveRepository.deleteById(id);
    }
}
