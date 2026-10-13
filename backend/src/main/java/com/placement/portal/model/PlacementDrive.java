package com.placement.portal.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "placement_drives")
public class PlacementDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String jobTitle;

    private String jobRole; // e.g. "Software Engineer", "Data Analyst", "Cloud Associate"

    @Column(length = 2000)
    private String jobDescription;

    @Column(nullable = false)
    private Double packageLpa; // e.g. 14.5

    @Column(nullable = false)
    private Double minCgpa; // e.g. 7.5

    @Column(nullable = false)
    private Integer maxBacklogsAllowed; // e.g. 0

    @Column(nullable = false)
    private String eligibleDepartments; // e.g. "CSE,IT,AI_DS,ECE"

    @Column(nullable = false)
    private Integer eligibleBatchYear; // e.g. 2026

    @Column(length = 1000)
    private String requiredSkills; // e.g. "Java, Spring Boot, React, SQL, Git"

    private LocalDate driveDate;
    private LocalDate applicationDeadline;

    @Column(nullable = false)
    private String status; // ACTIVE, UPCOMING, COMPLETED, CANCELLED

    private Integer totalOpenings;
    private String workLocation; // e.g. "Bangalore / Hybrid"

    public PlacementDrive() {
    }

    public PlacementDrive(Company company, String jobTitle, String jobRole, String jobDescription, Double packageLpa, Double minCgpa, Integer maxBacklogsAllowed, String eligibleDepartments, Integer eligibleBatchYear, String requiredSkills, LocalDate driveDate, LocalDate applicationDeadline, String status, Integer totalOpenings, String workLocation) {
        this.company = company;
        this.jobTitle = jobTitle;
        this.jobRole = jobRole;
        this.jobDescription = jobDescription;
        this.packageLpa = packageLpa;
        this.minCgpa = minCgpa;
        this.maxBacklogsAllowed = maxBacklogsAllowed;
        this.eligibleDepartments = eligibleDepartments;
        this.eligibleBatchYear = eligibleBatchYear;
        this.requiredSkills = requiredSkills;
        this.driveDate = driveDate;
        this.applicationDeadline = applicationDeadline;
        this.status = status;
        this.totalOpenings = totalOpenings;
        this.workLocation = workLocation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public Double getPackageLpa() {
        return packageLpa;
    }

    public void setPackageLpa(Double packageLpa) {
        this.packageLpa = packageLpa;
    }

    public Double getMinCgpa() {
        return minCgpa;
    }

    public void setMinCgpa(Double minCgpa) {
        this.minCgpa = minCgpa;
    }

    public Integer getMaxBacklogsAllowed() {
        return maxBacklogsAllowed;
    }

    public void setMaxBacklogsAllowed(Integer maxBacklogsAllowed) {
        this.maxBacklogsAllowed = maxBacklogsAllowed;
    }

    public String getEligibleDepartments() {
        return eligibleDepartments;
    }

    public void setEligibleDepartments(String eligibleDepartments) {
        this.eligibleDepartments = eligibleDepartments;
    }

    public Integer getEligibleBatchYear() {
        return eligibleBatchYear;
    }

    public void setEligibleBatchYear(Integer eligibleBatchYear) {
        this.eligibleBatchYear = eligibleBatchYear;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public LocalDate getDriveDate() {
        return driveDate;
    }

    public void setDriveDate(LocalDate driveDate) {
        this.driveDate = driveDate;
    }

    public LocalDate getApplicationDeadline() {
        return applicationDeadline;
    }

    public void setApplicationDeadline(LocalDate applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTotalOpenings() {
        return totalOpenings;
    }

    public void setTotalOpenings(Integer totalOpenings) {
        this.totalOpenings = totalOpenings;
    }

    public String getWorkLocation() {
        return workLocation;
    }

    public void setWorkLocation(String workLocation) {
        this.workLocation = workLocation;
    }
}
