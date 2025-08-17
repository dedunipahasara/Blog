package com.example.blog.service;

import com.example.blog.entity.Pin;
import com.example.blog.entity.User;
import com.example.blog.repository.PinRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class PinService {

    private final PinRepository pinRepository;
    private final String uploadDir = "uploads/";

    public PinService(PinRepository pinRepository) {
        this.pinRepository = pinRepository;
    }

    // Save a new pin
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

    // Edit pin
    public Pin editPin(User user, Long pinId, String title, String description, String category) {
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new RuntimeException("Pin not found"));

        if (!pin.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot edit this pin");
        }

        if (title != null) pin.setTitle(title);
        if (description != null) pin.setDescription(description);
        if (category != null) pin.setCategory(category);

        return pinRepository.save(pin);
    }

    // Delete pin
    public void deletePin(User user, Long pinId) {
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new RuntimeException("Pin not found"));

        if (!pin.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot delete this pin");
        }

        pinRepository.delete(pin);
    }

    // Get user's pins
    public List<Pin> getPinsByUser(User user) {
        return pinRepository.findByAuthor(user);
    }

    // Get all pins
    public List<Pin> getAllPins() {
        return pinRepository.findAll();
    }

    // Get pins by category
    public List<Pin> getPinsByCategory(String category) {
        return pinRepository.findByCategoryIgnoreCase(category);
    }

    // Search pins by title
    public List<Pin> searchPins(String search) {
        return pinRepository.findByTitleContainingIgnoreCase(search);
    }

    // Search pins by category AND title
    public List<Pin> searchPinsByCategory(String category, String search) {
        return pinRepository.findByCategoryIgnoreCaseAndTitleContainingIgnoreCase(category, search);
    }

    // Get pin by ID
    public Optional<Pin> getPinById(Long id) {
        return pinRepository.findById(id);
    }

    public Map<String, String> generateShareLinks(Long pinId) {
    String baseUrl = "http://localhost:8081"; // Change to deployed URL
    String pinUrl = baseUrl + "/api/pins/" + pinId;

    Map<String, String> links = new HashMap<>();
    links.put("copyLink", pinUrl);
    links.put("whatsapp", "https://wa.me/?text=" + URLEncoder.encode(pinUrl, StandardCharsets.UTF_8));
    links.put("facebook", "https://www.facebook.com/sharer/sharer.php?u=" + URLEncoder.encode(pinUrl, StandardCharsets.UTF_8));

    return links;
}

}
