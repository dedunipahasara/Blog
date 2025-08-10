package com.example.blog.controller;

import com.example.blog.dto.ProfileDto;
import com.example.blog.entity.User;
import com.example.blog.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get current user's profile
    @GetMapping
    public User getProfile(@AuthenticationPrincipal User user) {
        return user;
    }

    // Update current user's profile
    @PutMapping
    public User updateProfile(@AuthenticationPrincipal User user,
                              @RequestBody ProfileDto profileDto) {
        user.setFullName(profileDto.getFullName());
        user.setBio(profileDto.getBio());
        user.setProfileImageUrl(profileDto.getProfileImageUrl());
        return userRepository.save(user);
    }
}

