package com.example.blog.service;

import com.example.blog.entity.*;
import com.example.blog.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReactionService {

    private final ReactionRepository reactionRepository;
    private final FavouriteRepository favouriteRepository;
    private final PinRepository pinRepository;
    private final UserRepository userRepository;

    public void reactToPin(String username, Long pinId, ReactionType type) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new RuntimeException("Pin not found"));

        // Save or update reaction
        Reaction reaction = reactionRepository.findByUserIdAndPinId(user.getId(), pinId)
                .orElse(Reaction.builder().user(user).pin(pin).build());
        reaction.setType(type);
        reactionRepository.save(reaction);

        // Add to favourites if not already there
        if (!favouriteRepository.existsByUserIdAndPinId(user.getId(), pinId)) {
            Favourite fav = Favourite.builder()
                    .user(user)
                    .pin(pin)
                    .build();
            favouriteRepository.save(fav);
        }
    }
}
