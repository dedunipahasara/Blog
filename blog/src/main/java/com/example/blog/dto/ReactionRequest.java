// package com.example.blog.dto;

package com.example.blog.dto;

import com.example.blog.entity.ReactionType;

public class ReactionRequest {
    private ReactionType type;

    public ReactionType getType() {
        return type;
    }

    public void setType(ReactionType type) {
        this.type = type;
    }
}
