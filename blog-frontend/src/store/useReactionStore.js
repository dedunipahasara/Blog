import { create } from "zustand";
import axios from "../api/axios";

export const useReactionStore = create((set) => ({
  favourites: [],
  userReactions: {}, // { pinId: reactionType }

  // Fetch favourite pins
  fetchFavourites: async () => {
    try {
      const res = await axios.get("/reactions/favourites");
      const mappedFavourites = res.data.map((p) => ({
        ...p,
        fileUrl: `http://localhost:8081${p.mediaUrl}`,
        fileType: p.mediaType,
      }));
      set({ favourites: mappedFavourites });
    } catch (err) {
      console.error("Fetching favourites failed:", err);
    }
  },

  // React to a pin
  reactToPin: async (pinId, type) => {
    try {
      await axios.post(`/reactions/react?pinId=${pinId}`, { type });

      // Update userReactions state locally
      set((state) => ({
        userReactions: { ...state.userReactions, [pinId]: type },
      }));
    } catch (err) {
      console.error("Reaction failed:", err);
    }
  },

  // Fetch logged-in user's reaction for a specific pin
  fetchUserReaction: async (pinId) => {
    try {
      const res = await axios.get(`/reactions/my-reaction?pinId=${pinId}`);
      set((state) => ({
        userReactions: { ...state.userReactions, [pinId]: res.data },
      }));
    } catch (err) {
      console.error("Fetching user reaction failed:", err);
    }
  },
}));
