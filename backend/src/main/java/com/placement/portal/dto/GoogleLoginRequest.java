package com.placement.portal.dto;

public class GoogleLoginRequest {

    private String idToken;
    private String course;
    private Integer batchYear;
    private String rollNumber;

    public GoogleLoginRequest() {
    }

    public GoogleLoginRequest(String idToken, String course, Integer batchYear, String rollNumber) {
        this.idToken = idToken;
        this.course = course;
        this.batchYear = batchYear;
        this.rollNumber = rollNumber;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public Integer getBatchYear() {
        return batchYear;
    }

    public void setBatchYear(Integer batchYear) {
        this.batchYear = batchYear;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }
}
