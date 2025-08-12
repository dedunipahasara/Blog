package com.example.blog.controller;

import com.example.blog.dto.ProfileDto;
import com.example.blog.dto.SimpleUserDto;
import com.example.blog.entity.User;
import com.example.blog.repository.UserRepository;
import com.example.blog.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final UserService userService;

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

    // Follow user
    @PostMapping("/follow/{userId}")
    public ResponseEntity<?> followUser(@AuthenticationPrincipal User currentUser,
                                        @PathVariable Long userId) {
        try {
            userService.followUser(currentUser.getUsername(), userId);
            return ResponseEntity.ok("Successfully followed user");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Unfollow user
    @PostMapping("/unfollow/{userId}")
    public ResponseEntity<?> unfollowUser(@AuthenticationPrincipal User currentUser,
                                          @PathVariable Long userId) {
        try {
            userService.unfollowUser(currentUser.getUsername(), userId);
            return ResponseEntity.ok("Successfully unfollowed user");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get followers of a user
    @GetMapping("/{userId}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<SimpleUserDto> followers = user.getFollowers().stream()
                .map(SimpleUserDto::new)
                .collect(Collectors.toSet());

        return ResponseEntity.ok(followers);
    }

    // Get users followed by a user
    @GetMapping("/{userId}/following")
    public ResponseEntity<?> getFollowing(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<SimpleUserDto> following = user.getFollowing().stream()
                .map(SimpleUserDto::new)
                .collect(Collectors.toSet());

        return ResponseEntity.ok(following);
    }
}

