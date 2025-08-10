package com.example.blog.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;

    // Profile fields
    private String fullName;
    private String bio;
    private String profileImageUrl;
}

