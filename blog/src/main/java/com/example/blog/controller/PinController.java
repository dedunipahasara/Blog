package com.example.blog.controller;

import com.example.blog.entity.Pin;
import com.example.blog.entity.User;
import com.example.blog.repository.PinRepository;
import com.example.blog.repository.UserRepository;
import com.example.blog.service.PinService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pins")
public class PinController {

    private final PinRepository pinRepository;
    private final UserRepository userRepository;
    private final PinService pinService;

    @Value("${uploads.dir:uploads}")
    private String uploadsDir;

    public PinController(PinRepository pinRepository, UserRepository userRepository, PinService pinService) {
        this.pinRepository = pinRepository;
        this.userRepository = userRepository;
        this.pinService = pinService;
    }

    @GetMapping
    public List<Pin> allPins() {
        return pinRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createPin(@RequestParam("file") MultipartFile file,
                                       @RequestParam(value = "title", required = false) String title,
                                       @RequestParam(value = "description", required = false) String description,
                                       @RequestParam(value = "category", required = false) String category,
                                       Authentication authentication) throws IOException {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = authentication.getName();
        User author = userRepository.findByUsername(username).orElseThrow();

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is required");
        }

        String original = StringUtils.cleanPath(file.getOriginalFilename());
        String ext = "";
        int i = original.lastIndexOf('.');
        if (i >= 0) ext = original.substring(i);

        String generated = UUID.randomUUID().toString() + ext;

        Path uploadPath = Paths.get(uploadsDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        Path target = uploadPath.resolve(generated);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String contentType = file.getContentType() != null ? file.getContentType() : "";
        String mediaType = contentType.startsWith("video/") ? "video" : "image";

        Pin p = Pin.builder()
                .title(title)
                .description(description)
                .category(category)
                .mediaUrl("/uploads/" + generated)
                .mediaType(mediaType)
                .createdAt(LocalDateTime.now())
                .author(author)
                .build();

        pinRepository.save(p);

        return ResponseEntity.ok(p);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        return pinRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ This endpoint MUST be public (no auth required)
    @GetMapping("/{id}/share")
    public ResponseEntity<?> getShareLinks(@PathVariable Long id) {
        String baseUrl = "http://localhost:8080"; // Use env or config in real app
        return ResponseEntity.ok(pinService.generateShareLinks(id, baseUrl));
    }
}
