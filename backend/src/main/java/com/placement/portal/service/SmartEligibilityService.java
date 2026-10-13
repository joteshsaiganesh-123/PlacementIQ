package com.placement.portal.service;

import com.placement.portal.dto.EligibilityResultDto;
import com.placement.portal.model.PlacementDrive;
import com.placement.portal.model.StudentProfile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class SmartEligibilityService {

    public EligibilityResultDto checkEligibility(StudentProfile student, PlacementDrive drive) {
        EligibilityResultDto result = new EligibilityResultDto();
        result.setStudentCgpa(student.getCgpa());
        result.setRequiredCgpa(drive.getMinCgpa());
        result.setStudentBacklogs(student.getActiveBacklogs());
        result.setMaxAllowedBacklogs(drive.getMaxBacklogsAllowed());
        result.setStudentDepartment(student.getDepartment());
        result.setAllowedDepartments(drive.getEligibleDepartments());
        result.setStudentBatchYear(student.getBatchYear());
        result.setRequiredBatchYear(drive.getEligibleBatchYear());

        List<String> metCriteria = new ArrayList<>();
        List<String> failedReasons = new ArrayList<>();

        // 1. CGPA Check
        if (student.getCgpa() != null && student.getCgpa() >= drive.getMinCgpa()) {
            metCriteria.add("CGPA " + student.getCgpa() + " meets minimum requirement (" + drive.getMinCgpa() + ")");
        } else {
            failedReasons.add("CGPA " + (student.getCgpa() != null ? student.getCgpa() : 0.0) + " is below minimum requirement of " + drive.getMinCgpa());
        }

        // 2. Backlogs Check
        if (student.getActiveBacklogs() != null && student.getActiveBacklogs() <= drive.getMaxBacklogsAllowed()) {
            metCriteria.add("Active backlogs (" + student.getActiveBacklogs() + ") within maximum allowed (" + drive.getMaxBacklogsAllowed() + ")");
        } else {
            failedReasons.add("Active backlogs (" + student.getActiveBacklogs() + ") exceeds maximum limit of " + drive.getMaxBacklogsAllowed());
        }

        // 3. Department Check
        boolean deptMatches = false;
        if (drive.getEligibleDepartments() != null) {
            String[] allowed = drive.getEligibleDepartments().toUpperCase().split("[,;|\\s]+");
            String studentDept = student.getDepartment() != null ? student.getDepartment().trim().toUpperCase() : "";
            for (String d : allowed) {
                if (d.equals("ALL") || d.equals(studentDept)) {
                    deptMatches = true;
                    break;
                }
            }
        } else {
            deptMatches = true;
        }

        if (deptMatches) {
            metCriteria.add("Department (" + student.getDepartment() + ") is eligible");
        } else {
            failedReasons.add("Department (" + student.getDepartment() + ") is not in allowed list [" + drive.getEligibleDepartments() + "]");
        }

        // 4. Batch Year Check
        if (drive.getEligibleBatchYear() == null || drive.getEligibleBatchYear().equals(student.getBatchYear())) {
            metCriteria.add("Batch Year (" + student.getBatchYear() + ") is eligible");
        } else {
            failedReasons.add("Drive is designated for batch " + drive.getEligibleBatchYear() + ", your batch is " + student.getBatchYear());
        }

        result.setMetCriteria(metCriteria);
        result.setReasons(failedReasons);
        result.setEligible(failedReasons.isEmpty());

        return result;
    }
}
