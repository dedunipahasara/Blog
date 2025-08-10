package com.example.blog.dto;

import java.time.LocalDateTime;

public class CommentDto {
    private Long id;
    private String text;
    private String username;
    private LocalDateTime createdAt;

    public CommentDto(Long id, String text, String username, LocalDateTime createdAt) {
        this.id = id;
        this.text = text;
        this.username = username;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public String getUsername() {
        return username;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
