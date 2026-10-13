package com.placement.portal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "drive_id"})
})
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "drive_id", nullable = false)
    private PlacementDrive drive;

    @Column(nullable = false)
    private LocalDateTime appliedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    private Double atsScore; // 0.0 - 100.0%

    @Column(length = 1000)
    private String remarks;

    private LocalDateTime interviewDate;
    private String interviewVenueOrLink;
    private Double offerPackageLpa;

    public Application() {
    }

    public Application(StudentProfile student, PlacementDrive drive, Double atsScore) {
        this.student = student;
        this.drive = drive;
        this.atsScore = atsScore;
        this.appliedAt = LocalDateTime.now();
        this.status = ApplicationStatus.APPLIED;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StudentProfile getStudent() {
        return student;
    }

    public void setStudent(StudentProfile student) {
        this.student = student;
    }

    public PlacementDrive getDrive() {
        return drive;
    }

    public void setDrive(PlacementDrive drive) {
        this.drive = drive;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public Double getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(Double atsScore) {
        this.atsScore = atsScore;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(LocalDateTime interviewDate) {
        this.interviewDate = interviewDate;
    }

    public String getInterviewVenueOrLink() {
        return interviewVenueOrLink;
    }

    public void setInterviewVenueOrLink(String interviewVenueOrLink) {
        this.interviewVenueOrLink = interviewVenueOrLink;
    }

    public Double getOfferPackageLpa() {
        return offerPackageLpa;
    }

    public void setOfferPackageLpa(Double offerPackageLpa) {
        this.offerPackageLpa = offerPackageLpa;
    }
}
