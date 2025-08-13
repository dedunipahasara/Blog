import {create} from "zustand";

export const useStore = create((set) => ({
  user: null,
  token: null,
  pins: [],
  setUser: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
  setPins: (pins) => set({ pins }),
}));
