 package com.example.blog.repository;

import com.example.blog.entity.Favourite;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    boolean existsByUserIdAndPinId(Long userId, Long pinId);
        List<Favourite> findAllByUserId(Long userId);
}

 