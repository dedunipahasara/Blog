package com.example.blog.dto;

import com.example.blog.entity.User;
import lombok.Data;

@Data
public class SimpleUserDto {
    private Long id;
    private String username;
    private String fullName;
    private String profileImageUrl;

    public SimpleUserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.fullName = user.getFullName();
        this.profileImageUrl = user.getProfileImageUrl();
    }
}

