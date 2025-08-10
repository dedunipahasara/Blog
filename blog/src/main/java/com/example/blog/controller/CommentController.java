package com.example.blog.controller;

import com.example.blog.dto.CommentDto;
import com.example.blog.entity.Comment;
import com.example.blog.entity.User;
import com.example.blog.service.CommentService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/{pinId}")
    public Comment addComment(@AuthenticationPrincipal User user,
                            @PathVariable Long pinId,
                            @RequestBody String text) {
        // user is your entity, so user.getId(), user.getUsername() etc available
        return commentService.addComment(user, pinId, text);
    }


    @DeleteMapping("/{commentId}")
    public void deleteComment(@AuthenticationPrincipal User user, @PathVariable Long commentId) {
        // You can add authorization logic here if needed
        commentService.deleteComment(commentId);
    }

    @PutMapping("/{commentId}")
    public Comment updateComment(@AuthenticationPrincipal User user,
                                 @PathVariable Long commentId,
                                 @RequestBody String newText) {
        return commentService.updateComment(user, commentId, newText);
    }

    @GetMapping("/{pinId}")
    public List<CommentDto> getCommentsByPin(@PathVariable Long pinId) {
        List<Comment> comments = commentService.getCommentsByPin(pinId);
        return comments.stream()
                .map(c -> new CommentDto(
                        c.getId(),
                        c.getText(),
                        c.getUser().getUsername(),
                        c.getCreatedAt()))
                .toList();
    }
}
