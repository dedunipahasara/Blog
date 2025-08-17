package com.example.blog.repository;

import com.example.blog.entity.Pin;
import com.example.blog.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserIdAndPinId(Long userId, Long pinId);

    // New method to find all reactions for a specific pin
    List<Reaction> findByPin(Pin pin);
}

