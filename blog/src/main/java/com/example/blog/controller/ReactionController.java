package com.example.blog.controller;

import com.example.blog.dto.ReactionRequest;
import com.example.blog.entity.Pin;
import com.example.blog.entity.User;
import com.example.blog.service.ReactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reactions")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    // React to a pin
    @PostMapping("/react")
    public ResponseEntity<String> reactToPin(
            @RequestParam(required = false) Long pinId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category,
            @RequestBody ReactionRequest reactionRequest,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        reactionService.reactToPin(authentication.getName(), pinId, title, category, reactionRequest.getType());
        return ResponseEntity.ok("Reaction saved and added to favourites");
    }

    // Get all favourites of logged-in user
    @GetMapping("/favourites")
    public ResponseEntity<List<Pin>> getFavourites(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        List<Pin> favourites = reactionService.getFavouritesByUser(authentication.getName());
        return ResponseEntity.ok(favourites);
    }

    // Count reactions per pin
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> countReactions(@RequestParam Long pinId) {
        Map<String, Long> reactionCounts = reactionService.countReactions(pinId);
        return ResponseEntity.ok(reactionCounts);
    }

    // Get logged-in user's reaction to a pin
    @GetMapping("/my-reaction")
    public ResponseEntity<String> getUserReaction(
            @RequestParam Long pinId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String reactionType = reactionService.getUserReaction(authentication.getName(), pinId);
        return ResponseEntity.ok(reactionType);
    }
}
