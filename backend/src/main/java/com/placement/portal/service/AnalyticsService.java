package com.placement.portal.service;

import com.placement.portal.dto.AnalyticsSummaryDto;
import com.placement.portal.dto.DepartmentPlacementDto;
import com.placement.portal.model.Application;
import com.placement.portal.model.StudentProfile;
import com.placement.portal.repository.ApplicationRepository;
import com.placement.portal.repository.CompanyRepository;
import com.placement.portal.repository.PlacementDriveRepository;
import com.placement.portal.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final StudentProfileRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;

    public AnalyticsService(StudentProfileRepository studentRepository,
                            CompanyRepository companyRepository,
                            PlacementDriveRepository driveRepository,
                            ApplicationRepository applicationRepository) {
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.applicationRepository = applicationRepository;
    }

    public AnalyticsSummaryDto getPlacementAnalytics() {
        AnalyticsSummaryDto summary = new AnalyticsSummaryDto();

        List<StudentProfile> allStudents = studentRepository.findAll();
        List<Application> allApps = applicationRepository.findAll();

        long totalStudents = allStudents.size();
        long placedStudents = allStudents.stream().filter(s -> Boolean.TRUE.equals(s.getPlaced())).count();
        long unplacedStudents = totalStudents - placedStudents;

        double placementRate = totalStudents > 0 ? ((double) placedStudents / totalStudents) * 100.0 : 0.0;
        placementRate = Math.round(placementRate * 10.0) / 10.0;

        List<Double> packages = allStudents.stream()
                .filter(s -> Boolean.TRUE.equals(s.getPlaced()) && s.getPackageLpa() != null)
                .map(StudentProfile::getPackageLpa)
                .sorted()
                .collect(Collectors.toList());

        double highestPackage = packages.isEmpty() ? 0.0 : packages.get(packages.size() - 1);
        double avgPackage = packages.isEmpty() ? 0.0 : packages.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        avgPackage = Math.round(avgPackage * 10.0) / 10.0;

        double medianPackage = 0.0;
        if (!packages.isEmpty()) {
            int mid = packages.size() / 2;
            medianPackage = (packages.size() % 2 == 1) ? packages.get(mid) : (packages.get(mid - 1) + packages.get(mid)) / 2.0;
            medianPackage = Math.round(medianPackage * 10.0) / 10.0;
        }

        summary.setTotalStudents(totalStudents);
        summary.setPlacedStudents(placedStudents);
        summary.setUnplacedStudents(unplacedStudents);
        summary.setPlacementRate(placementRate);
        summary.setHighestPackage(highestPackage);
        summary.setAveragePackage(avgPackage);
        summary.setMedianPackage(medianPackage);

        summary.setTotalCompanies(companyRepository.count());
        summary.setActiveDrives(driveRepository.findByStatus("ACTIVE").size());
        summary.setTotalApplications(allApps.size());

        // Department-wise breakdown
        Map<String, List<StudentProfile>> byDept = allStudents.stream()
                .collect(Collectors.groupingBy(s -> s.getDepartment() != null ? s.getDepartment() : "General"));

        List<DepartmentPlacementDto> deptStats = new ArrayList<>();
        for (Map.Entry<String, List<StudentProfile>> entry : byDept.entrySet()) {
            String dept = entry.getKey();
            List<StudentProfile> deptStudents = entry.getValue();
            long dTotal = deptStudents.size();
            long dPlaced = deptStudents.stream().filter(s -> Boolean.TRUE.equals(s.getPlaced())).count();
            double dRate = dTotal > 0 ? Math.round(((double) dPlaced / dTotal) * 100.0 * 10.0) / 10.0 : 0.0;

            double dAvg = deptStudents.stream()
                    .filter(s -> Boolean.TRUE.equals(s.getPlaced()) && s.getPackageLpa() != null)
                    .mapToDouble(StudentProfile::getPackageLpa)
                    .average().orElse(0.0);
            dAvg = Math.round(dAvg * 10.0) / 10.0;

            deptStats.add(new DepartmentPlacementDto(dept, dTotal, dPlaced, dRate, dAvg));
        }
        deptStats.sort(Comparator.comparing(DepartmentPlacementDto::getPlacementRate).reversed());
        summary.setDepartmentStats(deptStats);

        // Application status counts
        Map<String, Long> statusCounts = allApps.stream()
                .collect(Collectors.groupingBy(a -> a.getStatus().name(), Collectors.counting()));
        summary.setApplicationStatusCounts(statusCounts);

        return summary;
    }
}
