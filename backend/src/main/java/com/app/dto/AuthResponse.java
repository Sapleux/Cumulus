package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type;
    private String username;
    private String email;
    private String role;

    public AuthResponse(String token, String username, String email, String role) {
        this.token = token;
        this.type = "Bearer";
        this.username = username;
        this.email = email;
        this.role = role;
    }
}
