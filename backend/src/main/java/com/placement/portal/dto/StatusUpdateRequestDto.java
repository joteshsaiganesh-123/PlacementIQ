package com.placement.portal.dto;

import com.placement.portal.model.ApplicationStatus;
import java.time.LocalDateTime;

public class StatusUpdateRequestDto {
    private ApplicationStatus status;
    private String remarks;
    private LocalDateTime interviewDate;
    private String interviewVenueOrLink;
    private Double offerPackageLpa;

    public StatusUpdateRequestDto() {}

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
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
