import { create } from "zustand";
import axios from "../api/axios";

export const useUserStore = create((set, get) => ({
  profile: null,
  followers: [],
  following: [],
  searchResults: [],

  fetchProfile: async () => {
    const res = await axios.get("/api/profile");
    set({ profile: res.data });

    // Optional: sync with AuthStore
    const { user } = get();
    if (user) set({ profile: { ...user, ...res.data } });
  },

  updateProfile: async (data) => {
    const res = await axios.put("/profile", data);
    set({ profile: res.data });
  },

  searchUsers: async (username) => {
    const res = await axios.get(`/profile/search?username=${username}`);
    set({ searchResults: res.data });
  },

  fetchFollowers: async (userId) => {
    const res = await axios.get(`/profile/${userId}/followers`);
    set({ followers: res.data });
  },

  fetchFollowing: async (userId) => {
    const res = await axios.get(`/profile/${userId}/following`);
    set({ following: res.data });
  },
}));
