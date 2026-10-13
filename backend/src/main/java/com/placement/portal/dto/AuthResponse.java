package com.placement.portal.dto;

import com.placement.portal.model.Role;

public class AuthResponse {
    private Long userId;
    private String name;
    private String email;
    private Role role;
    private Long studentProfileId;
    private String token;

    public AuthResponse() {}

    public AuthResponse(Long userId, String name, String email, Role role, Long studentProfileId, String token) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.studentProfileId = studentProfileId;
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Long getStudentProfileId() {
        return studentProfileId;
    }

    public void setStudentProfileId(Long studentProfileId) {
        this.studentProfileId = studentProfileId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
