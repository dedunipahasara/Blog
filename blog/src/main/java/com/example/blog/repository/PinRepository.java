package com.example.blog.repository;

import com.example.blog.entity.Pin;
import com.example.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PinRepository extends JpaRepository<Pin, Long> {

    List<Pin> findByAuthor(User author);

    Optional<Pin> findByTitle(String title);        // Use this in service
    Optional<Pin> findFirstByTitle(String title);  // Or add this if needed
    Optional<Pin> findFirstByCategory(String category);

    List<Pin> findByCategoryIgnoreCase(String category);

    List<Pin> findByTitleContainingIgnoreCase(String title);

    List<Pin> findByCategoryIgnoreCaseAndTitleContainingIgnoreCase(String category, String title);
}
