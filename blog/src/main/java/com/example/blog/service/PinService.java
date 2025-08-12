package com.example.blog.service;

import com.example.blog.entity.Pin;
import com.example.blog.entity.User;
import com.example.blog.repository.PinRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PinService {

    private final PinRepository pinRepository;
    private final String uploadDir = "uploads/";

    public PinService(PinRepository pinRepository) {
        this.pinRepository = pinRepository;
    }

    public Pin savePin(User user, String title, String description, String category,
                       MultipartFile file) throws IOException {

        if (!Files.exists(Paths.get(uploadDir))) {
            Files.createDirectories(Paths.get(uploadDir));
        }

        String originalFilename = file.getOriginalFilename();
        String ext = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String filename = UUID.randomUUID().toString() + ext;
        Path filepath = Paths.get(uploadDir, filename);

        Files.copy(file.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);

        String mediaType = file.getContentType() != null && file.getContentType().startsWith("video")
                ? "video"
                : "image";

        Pin pin = Pin.builder()
                .author(user)
                .title(title)
                .description(description)
                .category(category)
                .mediaUrl("/uploads/" + filename)
                .mediaType(mediaType)
                .createdAt(LocalDateTime.now())
                .build();

        return pinRepository.save(pin);
    }

    public List<Pin> getAllPins() {
        return pinRepository.findAll();
    }

    public Optional<Pin> getPinById(Long id) {
        return pinRepository.findById(id);
    }

    public void deletePin(Long id) {
        pinRepository.deleteById(id);
    }

    // Share links generator
    public Map<String, String> generateShareLinks(Long pinId, String baseUrl) {
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new RuntimeException("Pin not found"));

        String pinUrl = baseUrl + "/pins/" + pinId;

        Map<String, String> shareLinks = new HashMap<>();
        shareLinks.put("whatsapp", "https://api.whatsapp.com/send?text=" + pinUrl);
        shareLinks.put("facebook", "https://www.facebook.com/sharer/sharer.php?u=" + pinUrl);
        shareLinks.put("link", pinUrl);

        return shareLinks;
    }
}
