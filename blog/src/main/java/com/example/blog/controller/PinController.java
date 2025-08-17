package com.example.blog.controller;

import com.example.blog.entity.Pin;
import com.example.blog.entity.User;
import com.example.blog.service.PinService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/pins")
public class PinController {

    private final PinService pinService;

    public PinController(PinService pinService) {
        this.pinService = pinService;
    }

    // Upload pin
    @PostMapping
    public ResponseEntity<?> createPin(@RequestParam("file") MultipartFile file,
                                       @RequestParam(value = "title", required = false) String title,
                                       @RequestParam(value = "description", required = false) String description,
                                       @RequestParam(value = "category", required = false) String category,
                                       @AuthenticationPrincipal User user) throws IOException {

        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        if (file == null || file.isEmpty()) return ResponseEntity.badRequest().body("File is required");

        Pin pin = pinService.savePin(user, title, description, category, file);
        return ResponseEntity.ok(pin);
    }

    // Edit pin
    @PutMapping("/{id}")
    public ResponseEntity<?> editPin(@PathVariable Long id,
                                     @RequestParam(value = "title", required = false) String title,
                                     @RequestParam(value = "description", required = false) String description,
                                     @RequestParam(value = "category", required = false) String category,
                                     @AuthenticationPrincipal User user) {

        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        try {
            Pin updated = pinService.editPin(user, id, title, description, category);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // Delete pin
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePin(@PathVariable Long id,
                                       @AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        try {
            pinService.deletePin(user, id);
            return ResponseEntity.ok("Pin deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // Get user's pins
    @GetMapping("/my-pins")
    public ResponseEntity<List<Pin>> getMyPins(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(pinService.getPinsByUser(user));
    }

    // Explore feed with search
    @GetMapping("/explore")
    public ResponseEntity<List<Pin>> explorePins(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "search", required = false) String search) {

        List<Pin> pins;

        if (category != null && !category.isEmpty() && search != null && !search.isEmpty()) {
            pins = pinService.searchPinsByCategory(category, search);
        } else if (category != null && !category.isEmpty()) {
            pins = pinService.getPinsByCategory(category);
        } else if (search != null && !search.isEmpty()) {
            pins = pinService.searchPins(search);
        } else {
            pins = pinService.getAllPins();
        }

        return ResponseEntity.ok(pins);
    }
    // Explore feed (by category)


// Search pins (by title)
@GetMapping("/search")
public ResponseEntity<List<Pin>> searchPins(
        @RequestParam("query") String query) {

    if (query == null || query.isEmpty()) {
        return ResponseEntity.badRequest().build();
    }

    List<Pin> pins = pinService.searchPins(query);
    return ResponseEntity.ok(pins);
}


    // Get pin by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        return pinService.getPinById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/share")
public ResponseEntity<?> getShareLinks(@PathVariable Long id) {
    if (pinService.getPinById(id).isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(pinService.generateShareLinks(id));
}

}
