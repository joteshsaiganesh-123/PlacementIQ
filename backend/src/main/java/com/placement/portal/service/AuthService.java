package com.placement.portal.service;

import com.placement.portal.dto.AuthResponse;
import com.placement.portal.dto.GoogleLoginRequest;
import com.placement.portal.dto.LoginRequest;
import com.placement.portal.dto.RegisterRequest;
import com.placement.portal.model.Role;
import com.placement.portal.model.StudentProfile;
import com.placement.portal.model.User;
import com.placement.portal.repository.StudentProfileRepository;
import com.placement.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentRepository;
    private final RestTemplate restTemplate;

    @Value("${google.client.id:}")
    private String configuredGoogleClientId;

    public AuthService(UserRepository userRepository, StudentProfileRepository studentRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.restTemplate = new RestTemplate();
    }

    public AuthResponse authenticate(LoginRequest request) {
        String cleanEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new IllegalArgumentException("No account found with email: " + request.getEmail()));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Incorrect password. Please try again.");
        }

        Long studentProfileId = null;
        if (user.getRole() == Role.STUDENT) {
            Optional<StudentProfile> sp = studentRepository.findByUserId(user.getId());
            if (sp.isPresent()) {
                studentProfileId = sp.get().getId();
            }
        }

        String simulatedToken = "jwt-session-" + user.getId() + "-" + System.currentTimeMillis();
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), studentProfileId, simulatedToken);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String cleanEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        if (cleanEmail.isEmpty()) {
            throw new IllegalArgumentException("Email address cannot be empty.");
        }

        if (userRepository.existsByEmail(cleanEmail)) {
            throw new IllegalArgumentException("An account with email " + cleanEmail + " already exists. Please log in.");
        }

        if (request.getPassword() == null || request.getPassword().trim().length() < 3) {
            throw new IllegalArgumentException("Password must be at least 3 characters long.");
        }

        User user = new User();
        user.setName(request.getName() != null && !request.getName().trim().isEmpty() ? request.getName().trim() : "New User");
        user.setEmail(cleanEmail);
        user.setPassword(request.getPassword());
        user.setRole(request.getRole() != null ? request.getRole() : Role.STUDENT);
        user = userRepository.save(user);

        Long studentProfileId = null;
        if (user.getRole() == Role.STUDENT) {
            String roll = request.getRollNumber();
            if (roll == null || roll.trim().isEmpty()) {
                roll = "2026" + (request.getDepartment() != null ? request.getDepartment().substring(0, Math.min(2, request.getDepartment().length())).toUpperCase() : "CS") + (200 + user.getId());
            }

            StudentProfile profile = new StudentProfile(
                    user,
                    roll.trim().toUpperCase(),
                    request.getDepartment() != null ? request.getDepartment().trim().toUpperCase() : "CSE",
                    request.getBatchYear() != null ? request.getBatchYear() : 2026,
                    request.getCgpa() != null ? request.getCgpa() : 8.0,
                    request.getActiveBacklogs() != null ? request.getActiveBacklogs() : 0,
                    request.getSkills() != null && !request.getSkills().trim().isEmpty() ? request.getSkills() : "Java, Spring Boot, React, SQL, Git",
                    request.getResumeHeadline() != null && !request.getResumeHeadline().trim().isEmpty() ? request.getResumeHeadline() : "Aspiring Software Engineer"
            );
            profile = studentRepository.save(profile);
            studentProfileId = profile.getId();
        }

        String simulatedToken = "jwt-session-" + user.getId() + "-" + System.currentTimeMillis();
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), studentProfileId, simulatedToken);
    }

    @Transactional
    public AuthResponse authenticateWithGoogle(GoogleLoginRequest request) {
        if (request == null || request.getIdToken() == null || request.getIdToken().trim().isEmpty()) {
            throw new IllegalArgumentException("Google ID token cannot be empty.");
        }

        String idToken = request.getIdToken().trim();
        String email;
        String name;

        // Check if token is mock or live token
        if (idToken.startsWith("mock-google-token") || idToken.startsWith("dev-google-token")) {
            email = "student.google@college.edu";
            name = "Google Authenticated Student";
        } else {
            // Validate Google ID token via Google TokenInfo API
            try {
                String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
                @SuppressWarnings("unchecked")
                Map<String, Object> body = restTemplate.getForObject(tokenInfoUrl, Map.class);

                if (body == null || !body.containsKey("email")) {
                    throw new IllegalArgumentException("Google ID token does not contain a verified email address.");
                }

                // Verify audience if configured
                if (configuredGoogleClientId != null && !configuredGoogleClientId.trim().isEmpty()) {
                    String aud = (String) body.get("aud");
                    if (!configuredGoogleClientId.trim().equals(aud)) {
                        throw new IllegalArgumentException("Google ID token audience mismatch with configured Client ID.");
                    }
                }

                email = ((String) body.get("email")).toLowerCase().trim();
                name = (String) body.get("name");
                if (name == null || name.trim().isEmpty()) {
                    name = (String) body.get("given_name");
                }
                if (name == null || name.trim().isEmpty()) {
                    name = "Google Student";
                }
            } catch (IllegalArgumentException ex) {
                throw ex;
            } catch (Exception ex) {
                throw new IllegalArgumentException("Google ID token verification failed: " + ex.getMessage());
            }
        }

        // Check if user already exists
        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        User user;
        Long studentProfileId = null;

        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
            // Preserve student Course and Batch information if student profile exists
            if (user.getRole() == Role.STUDENT) {
                Optional<StudentProfile> sp = studentRepository.findByUserId(user.getId());
                if (sp.isPresent()) {
                    studentProfileId = sp.get().getId();
                    // Course and Batch are preserved from existing profile!
                } else {
                    // Create missing profile preserving course and batch from request
                    String course = (request.getCourse() != null && !request.getCourse().trim().isEmpty()) ? request.getCourse().trim().toUpperCase() : "CSE";
                    Integer batch = (request.getBatchYear() != null && request.getBatchYear() > 2000) ? request.getBatchYear() : 2026;
                    String roll = (request.getRollNumber() != null && !request.getRollNumber().trim().isEmpty()) ? request.getRollNumber().trim().toUpperCase() : "2026" + course.substring(0, Math.min(2, course.length())) + (100 + user.getId());

                    StudentProfile profile = new StudentProfile(
                            user, roll, course, batch, 8.0, 0,
                            "Java, Spring Boot, React, SQL, Git",
                            "Google Verified Candidate"
                    );
                    profile = studentRepository.save(profile);
                    studentProfileId = profile.getId();
                }
            }
        } else {
            // Register new Google student
            user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword("GOOGLE_OAUTH_" + System.currentTimeMillis());
            user.setRole(Role.STUDENT);
            user = userRepository.save(user);

            String course = (request.getCourse() != null && !request.getCourse().trim().isEmpty()) ? request.getCourse().trim().toUpperCase() : "CSE";
            Integer batch = (request.getBatchYear() != null && request.getBatchYear() > 2000) ? request.getBatchYear() : 2026;
            String roll = (request.getRollNumber() != null && !request.getRollNumber().trim().isEmpty()) ? request.getRollNumber().trim().toUpperCase() : "2026" + course.substring(0, Math.min(2, course.length())) + (100 + user.getId());

            StudentProfile profile = new StudentProfile(
                    user, roll, course, batch, 8.0, 0,
                    "Java, Spring Boot, React, SQL, Git",
                    "Google Verified Candidate"
            );
            profile = studentRepository.save(profile);
            studentProfileId = profile.getId();
        }

        String simulatedToken = "jwt-session-" + user.getId() + "-" + System.currentTimeMillis();
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), studentProfileId, simulatedToken);
    }
}
