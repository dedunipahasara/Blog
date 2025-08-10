package com.example.blog.service;

import org.springframework.stereotype.Service;
import com.example.blog.entity.Comment;
import com.example.blog.entity.Pin;
import com.example.blog.entity.User;
import com.example.blog.repository.CommentRepository;
import com.example.blog.repository.PinRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PinRepository pinRepository;

    public CommentService(CommentRepository commentRepository,
                          PinRepository pinRepository) {
        this.commentRepository = commentRepository;
        this.pinRepository = pinRepository;
    }

    public Comment addComment(User user, Long pinId, String text) {
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new RuntimeException("Pin not found"));

        Comment comment = Comment.builder()
                .pin(pin)
                .user(user)
                .text(text)
                .createdAt(LocalDateTime.now())
                .build();

        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPin(Long pinId) {
        return commentRepository.findByPinId(pinId);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    public Comment updateComment(User user, Long commentId, String newText) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to update this comment");
        }

        comment.setText(newText);
        return commentRepository.save(comment);
    }
}
