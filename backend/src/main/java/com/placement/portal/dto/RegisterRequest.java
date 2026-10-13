package com.placement.portal.dto;

import com.placement.portal.model.Role;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role = Role.STUDENT;

    // Student fields
    private String rollNumber;
    private String department = "CSE";
    private Integer batchYear = 2026;
    private Double cgpa = 8.0;
    private Integer activeBacklogs = 0;
    private String skills = "Java, Spring Boot, React, SQL, Git";
    private String resumeHeadline;

    public RegisterRequest() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getBatchYear() {
        return batchYear;
    }

    public void setBatchYear(Integer batchYear) {
        this.batchYear = batchYear;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public Integer getActiveBacklogs() {
        return activeBacklogs;
    }

    public void setActiveBacklogs(Integer activeBacklogs) {
        this.activeBacklogs = activeBacklogs;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getResumeHeadline() {
        return resumeHeadline;
    }

    public void setResumeHeadline(String resumeHeadline) {
        this.resumeHeadline = resumeHeadline;
    }
}
