package com.example.blog.controller;

import com.example.blog.entity.ReactionType;
import com.example.blog.service.ReactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reactions")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    @PostMapping("/{pinId}")
    public ResponseEntity<String> reactToPin(
            @PathVariable Long pinId,
            @RequestParam ReactionType type,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = authentication.getName();
        reactionService.reactToPin(username, pinId, type);

        return ResponseEntity.ok("Reaction saved and added to favourites");
    }
}
