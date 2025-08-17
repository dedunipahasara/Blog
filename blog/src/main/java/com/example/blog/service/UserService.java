package com.example.blog.service;

import com.example.blog.entity.User;
import com.example.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public User registerUser(User user) {
        // Only Gmail emails allowed
        if (!user.getEmail().toLowerCase().endsWith("@gmail.com")) {
            throw new IllegalArgumentException("Only Gmail addresses allowed");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already taken");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerified(false);
        user.setVerificationCode(UUID.randomUUID().toString());
        User savedUser = userRepository.save(user);

        // Send registration and verification email
        emailService.sendSimpleMessage(user.getEmail(),
                "Registration Successful",
                "Welcome " + user.getUsername() + "! You have successfully registered.");

        emailService.sendSimpleMessage(user.getEmail(),
                "Email Verification",
                "Please verify your email by clicking the link: " +
                "http://localhost:8081/api/auth/verify?code=" + user.getVerificationCode());

        return savedUser;
    }

    public boolean verifyUser(String code) {
        Optional<User> userOpt = userRepository.findByVerificationCode(code);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        user.setVerified(true);
        user.setVerificationCode(null);
        userRepository.save(user);
        return true;
    }

    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void sendOtpForPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String otp = String.valueOf((int)((Math.random() * 900000) + 100000)); // 6-digit OTP
        user.setOtp(otp);
        userRepository.save(user);

        emailService.sendSimpleMessage(email, "OTP for Password Reset", "Your OTP is: " + otp);
    }

    public boolean verifyOtpAndResetPassword(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            return false;
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        userRepository.save(user);
        return true;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // --- New follow/unfollow methods ---

    public void followUser(String followerUsername, Long followeeId) {
        User follower = userRepository.findByUsername(followerUsername)
                .orElseThrow(() -> new RuntimeException("Follower user not found"));
        User followee = userRepository.findById(followeeId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        if (follower.equals(followee)) {
            throw new IllegalArgumentException("You cannot follow yourself");
        }

        follower.getFollowing().add(followee);
        userRepository.save(follower);
    }

    public void unfollowUser(String followerUsername, Long followeeId) {
        User follower = userRepository.findByUsername(followerUsername)
                .orElseThrow(() -> new RuntimeException("Follower user not found"));
        User followee = userRepository.findById(followeeId)
                .orElseThrow(() -> new RuntimeException("User to unfollow not found"));

        follower.getFollowing().remove(followee);
        userRepository.save(follower);
    }
    public void deleteUserByUsername(String username) {
    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    userRepository.delete(user);
}

}

