package com.example.blog.controller;

import com.example.blog.entity.Comment;
import com.example.blog.entity.Pin;
import com.example.blog.entity.User;
import com.example.blog.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // Add a comment to a pin (by id, title, or category)
    @PostMapping("/add")
    public ResponseEntity<Comment> addComment(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Long pinId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category,
            @RequestBody String text) {

        Pin pin = commentService.findPinByIdOrTitleOrCategory(pinId, title, category);
        Comment comment = commentService.addComment(user, pin.getId(), text);
        return ResponseEntity.ok(comment);
    }

    // Update a comment
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long commentId,
            @RequestBody String newText) {

        try {
            Comment updated = commentService.updateComment(user, commentId, newText);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // Delete a comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long commentId) {

        Comment comment = commentService.getCommentById(commentId);

        if (!comment.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to delete this comment");
        }

        commentService.deleteComment(commentId);
        return ResponseEntity.ok("Comment deleted successfully");
    }

    // Get comments for a pin
    @GetMapping("/pin")
    public ResponseEntity<List<Comment>> getCommentsByPin(
            @RequestParam(required = false) Long pinId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category) {

        Pin pin = commentService.findPinByIdOrTitleOrCategory(pinId, title, category);
        List<Comment> comments = commentService.getCommentsByPin(pin.getId());
        return ResponseEntity.ok(comments);
    }

    // New endpoint to count comments for a pin
    @GetMapping("/count")
    public ResponseEntity<Long> countComments(
            @RequestParam(required = false) Long pinId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category) {

        Pin pin = commentService.findPinByIdOrTitleOrCategory(pinId, title, category);
        long commentCount = commentService.countCommentsByPin(pin.getId());
        return ResponseEntity.ok(commentCount);
    }
}
