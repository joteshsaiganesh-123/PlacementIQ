package com.placement.portal.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsSummaryDto {
    private long totalStudents;
    private long placedStudents;
    private long unplacedStudents;
    private double placementRate;
    private long totalCompanies;
    private long activeDrives;
    private long totalApplications;
    private double highestPackage;
    private double averagePackage;
    private double medianPackage;
    private List<DepartmentPlacementDto> departmentStats;
    private Map<String, Long> applicationStatusCounts;

    public AnalyticsSummaryDto() {}

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getPlacedStudents() {
        return placedStudents;
    }

    public void setPlacedStudents(long placedStudents) {
        this.placedStudents = placedStudents;
    }

    public long getUnplacedStudents() {
        return unplacedStudents;
    }

    public void setUnplacedStudents(long unplacedStudents) {
        this.unplacedStudents = unplacedStudents;
    }

    public double getPlacementRate() {
        return placementRate;
    }

    public void setPlacementRate(double placementRate) {
        this.placementRate = placementRate;
    }

    public long getTotalCompanies() {
        return totalCompanies;
    }

    public void setTotalCompanies(long totalCompanies) {
        this.totalCompanies = totalCompanies;
    }

    public long getActiveDrives() {
        return activeDrives;
    }

    public void setActiveDrives(long activeDrives) {
        this.activeDrives = activeDrives;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public double getHighestPackage() {
        return highestPackage;
    }

    public void setHighestPackage(double highestPackage) {
        this.highestPackage = highestPackage;
    }

    public double getAveragePackage() {
        return averagePackage;
    }

    public void setAveragePackage(double averagePackage) {
        this.averagePackage = averagePackage;
    }

    public double getMedianPackage() {
        return medianPackage;
    }

    public void setMedianPackage(double medianPackage) {
        this.medianPackage = medianPackage;
    }

    public List<DepartmentPlacementDto> getDepartmentStats() {
        return departmentStats;
    }

    public void setDepartmentStats(List<DepartmentPlacementDto> departmentStats) {
        this.departmentStats = departmentStats;
    }

    public Map<String, Long> getApplicationStatusCounts() {
        return applicationStatusCounts;
    }

    public void setApplicationStatusCounts(Map<String, Long> applicationStatusCounts) {
        this.applicationStatusCounts = applicationStatusCounts;
    }
}
