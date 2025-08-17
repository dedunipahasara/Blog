import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

export const usePinStore = create((set, get) => ({
  pins: [],
  categories: [],

  // Fetch all pins or by category
  fetchPins: async (category) => {
    try {
      let url = "/pins/explore";
      if (category) url += `?category=${category}`;

      const res = await api.get(url);

      const pins = res.data.map((p) => ({
        ...p,
        fileUrl: `http://localhost:8081${p.mediaUrl}`,
        fileType: p.mediaType,
      }));

      set({ pins });

      // Only unique category names
      const cats = Array.from(new Set(res.data.map((p) => p.category).filter(Boolean)));
      set({ categories: cats });

    } catch (err) {
      console.error("Failed fetching pins:", err);
      toast.error(
        err.response?.status === 403
          ? "Access forbidden. Please verify your email or login."
          : "Failed to fetch pins"
      );
    }
  },

  // Upload a new pin
  uploadPin: async (formData) => {
    try {
      const res = await api.post("/pins", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Pin uploaded successfully!");

      const newPin = {
        ...res.data,
        fileUrl: `http://localhost:8081${res.data.mediaUrl}`,
        fileType: res.data.mediaType,
      };

      set((state) => ({ pins: [newPin, ...state.pins] }));

      // Update categories with unique values only
      const cats = Array.from(
        new Set([newPin.category, ...get().categories].filter(Boolean))
      );
      set({ categories: cats });

    } catch (err) {
      console.error("Pin upload failed:", err);
      toast.error(err?.response?.data || "Upload failed");
    }
  },

  // Search pins
  searchPins: async (query) => {
    try {
      if (!query) return [];
      const res = await api.get(`/pins/search?query=${query}`);
      const pins = res.data.map((p) => ({
        ...p,
        fileUrl: `http://localhost:8081${p.mediaUrl}`,
        fileType: p.mediaType,
      }));
      set({ pins });
      return pins;
    } catch (err) {
      console.error("Pin search failed:", err);
      toast.error("Search failed");
      return [];
    }
  },
}));
