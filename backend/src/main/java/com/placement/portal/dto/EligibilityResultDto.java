package com.placement.portal.dto;

import java.util.ArrayList;
import java.util.List;

public class EligibilityResultDto {
    private boolean eligible;
    private Double studentCgpa;
    private Double requiredCgpa;
    private Integer studentBacklogs;
    private Integer maxAllowedBacklogs;
    private String studentDepartment;
    private String allowedDepartments;
    private Integer studentBatchYear;
    private Integer requiredBatchYear;
    private List<String> metCriteria = new ArrayList<>();
    private List<String> reasons = new ArrayList<>();

    public EligibilityResultDto() {}

    public boolean isEligible() {
        return eligible;
    }

    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }

    public Double getStudentCgpa() {
        return studentCgpa;
    }

    public void setStudentCgpa(Double studentCgpa) {
        this.studentCgpa = studentCgpa;
    }

    public Double getRequiredCgpa() {
        return requiredCgpa;
    }

    public void setRequiredCgpa(Double requiredCgpa) {
        this.requiredCgpa = requiredCgpa;
    }

    public Integer getStudentBacklogs() {
        return studentBacklogs;
    }

    public void setStudentBacklogs(Integer studentBacklogs) {
        this.studentBacklogs = studentBacklogs;
    }

    public Integer getMaxAllowedBacklogs() {
        return maxAllowedBacklogs;
    }

    public void setMaxAllowedBacklogs(Integer maxAllowedBacklogs) {
        this.maxAllowedBacklogs = maxAllowedBacklogs;
    }

    public String getStudentDepartment() {
        return studentDepartment;
    }

    public void setStudentDepartment(String studentDepartment) {
        this.studentDepartment = studentDepartment;
    }

    public String getAllowedDepartments() {
        return allowedDepartments;
    }

    public void setAllowedDepartments(String allowedDepartments) {
        this.allowedDepartments = allowedDepartments;
    }

    public Integer getStudentBatchYear() {
        return studentBatchYear;
    }

    public void setStudentBatchYear(Integer studentBatchYear) {
        this.studentBatchYear = studentBatchYear;
    }

    public Integer getRequiredBatchYear() {
        return requiredBatchYear;
    }

    public void setRequiredBatchYear(Integer requiredBatchYear) {
        this.requiredBatchYear = requiredBatchYear;
    }

    public List<String> getMetCriteria() {
        return metCriteria;
    }

    public void setMetCriteria(List<String> metCriteria) {
        this.metCriteria = metCriteria;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }
}
