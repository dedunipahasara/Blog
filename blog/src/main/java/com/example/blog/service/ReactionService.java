package com.example.blog.service;

import com.example.blog.entity.*;
import com.example.blog.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReactionService {

    private final ReactionRepository reactionRepository;
    private final FavouriteRepository favouriteRepository;
    private final PinRepository pinRepository;
    private final UserRepository userRepository;

    // React to a pin
    public void reactToPin(String username, Long pinId, String title, String category, ReactionType type) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pin pin = findPinByIdOrTitleOrCategory(pinId, title, category);

        Reaction reaction = reactionRepository.findByUserIdAndPinId(user.getId(), pin.getId())
                .orElse(Reaction.builder().user(user).pin(pin).build());

        reaction.setType(type);
        reactionRepository.save(reaction);

        // Add to favourites if not already
        if (!favouriteRepository.existsByUserIdAndPinId(user.getId(), pin.getId())) {
            Favourite fav = Favourite.builder().user(user).pin(pin).build();
            favouriteRepository.save(fav);
        }
    }

    // Get all favourites of a user
    public List<Pin> getFavouritesByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return favouriteRepository.findAllByUserId(user.getId())
                .stream()
                .map(Favourite::getPin)
                .collect(Collectors.toList());
    }

    // Count reactions per pin
    public Map<String, Long> countReactions(Long pinId) {
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new RuntimeException("Pin not found with id " + pinId));

        List<Reaction> reactions = reactionRepository.findByPin(pin);

        return reactions.stream()
                .collect(Collectors.groupingBy(r -> r.getType().name(), Collectors.counting()));
    }

    // Get logged-in user's reaction for a pin
    public String getUserReaction(String username, Long pinId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new RuntimeException("Pin not found"));

        return reactionRepository.findByUserIdAndPinId(user.getId(), pin.getId())
                .map(r -> r.getType().name())
                .orElse("NONE"); // No reaction yet
    }

    // Find pin by id, title, or category
    public Pin findPinByIdOrTitleOrCategory(Long id, String title, String category) {
        if (id != null) {
            return pinRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Pin not found with id: " + id));
        } else if (title != null) {
            return pinRepository.findByTitle(title)
                    .orElseThrow(() -> new RuntimeException("Pin not found with title: " + title));
        } else if (category != null) {
            return pinRepository.findFirstByCategory(category)
                    .orElseThrow(() -> new RuntimeException("Pin not found with category: " + category));
        } else {
            throw new IllegalArgumentException("Must provide id, title, or category");
        }
    }
}
