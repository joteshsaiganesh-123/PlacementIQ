package com.placement.portal.service;

import com.placement.portal.dto.AtsMatchResultDto;
import com.placement.portal.model.PlacementDrive;
import com.placement.portal.model.StudentProfile;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SmartAtsService {

    public AtsMatchResultDto analyzeMatch(StudentProfile student, PlacementDrive drive) {
        AtsMatchResultDto result = new AtsMatchResultDto();

        List<String> studentSkills = parseSkills(student.getSkills());
        List<String> requiredSkills = parseSkills(drive.getRequiredSkills());

        result.setStudentSkills(studentSkills);
        result.setRequiredSkills(requiredSkills);

        if (requiredSkills.isEmpty()) {
            result.setMatchPercentage(90.0);
            result.setReadinessLevel("Exceptional Match (General Criteria)");
            result.setRecommendation("No specific skill restrictions specified. Your academic profile is competitive!");
            return result;
        }

        List<String> matching = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String req : requiredSkills) {
            boolean found = false;
            for (String stud : studentSkills) {
                if (isSkillMatch(req, stud)) {
                    found = true;
                    matching.add(req);
                    break;
                }
            }
            if (!found) {
                missing.add(req);
            }
        }

        result.setMatchingSkills(matching);
        result.setMissingSkills(missing);

        double ratio = (double) matching.size() / (double) requiredSkills.size();
        double baseScore = Math.round(ratio * 100.0 * 10.0) / 10.0;
        
        // Base academic boost (up to +10% for CGPA > 8.0)
        if (student.getCgpa() != null && student.getCgpa() >= 8.0 && baseScore < 95.0) {
            baseScore = Math.min(100.0, baseScore + 5.0);
        }

        result.setMatchPercentage(baseScore);

        if (baseScore >= 80.0) {
            result.setReadinessLevel("Exceptional Match (Top 5% Candidate)");
            result.setRecommendation("Your tech stack closely mirrors the job requirements. Emphasize project architecture and system design in technical interviews.");
        } else if (baseScore >= 60.0) {
            result.setReadinessLevel("Competitive Match (Strong Potential)");
            result.setRecommendation("You match key core skills. Review " + String.join(", ", missing) + " to maximize your technical round clearance rate.");
        } else if (baseScore >= 40.0) {
            result.setReadinessLevel("Moderate Match (Upskilling Advantageous)");
            result.setRecommendation("You have foundational skills. We advise brushing up on " + String.join(", ", missing) + " before the drive assessment.");
        } else {
            result.setReadinessLevel("Skill Gap Detected");
            result.setRecommendation("Significant skill gap for this specific role. Focus on mastering " + String.join(", ", missing) + " via capstone projects.");
        }

        return result;
    }

    private List<String> parseSkills(String raw) {
        if (raw == null || raw.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(raw.split("[,;\\n]+"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private boolean isSkillMatch(String req, String studentSkill) {
        String r = req.toLowerCase().replaceAll("[^a-z0-9]", "");
        String s = studentSkill.toLowerCase().replaceAll("[^a-z0-9]", "");

        if (r.equals(s) || r.contains(s) || s.contains(r)) {
            return true;
        }

        // Common synonyms / equivalents
        if ((r.contains("js") && s.contains("javascript")) || (s.contains("js") && r.contains("javascript"))) return true;
        if ((r.contains("spring") && s.contains("springboot")) || (s.contains("spring") && r.contains("springboot"))) return true;
        if ((r.contains("ml") && s.contains("machinelearning")) || (s.contains("ml") && r.contains("machinelearning"))) return true;
        if ((r.contains("ai") && s.contains("artificialintelligence")) || (s.contains("ai") && r.contains("artificialintelligence"))) return true;
        if ((r.contains("db") && s.contains("database")) || (s.contains("db") && r.contains("database"))) return true;
        if ((r.contains("sql") && s.contains("mysql")) || (s.contains("sql") && r.contains("postgres"))) return true;

        return false;
    }
}
