import { create } from "zustand";
import api from "../api/axios";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  login: async (username, password) => {
    // Call the correct API
    const res = await api.post("/auth/login", { username, password });
    const token = res.data.token;

    // Save token
    localStorage.setItem("token", token);
    set({ token });

    // Set default header for future requests
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Fetch profile
    const userRes = await api.get("/profile");
    set({ user: userRes.data });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });

    // Remove default header
    delete api.defaults.headers.common["Authorization"];
  },
}));
