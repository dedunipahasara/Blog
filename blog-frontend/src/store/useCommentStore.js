import { create } from "zustand";
import axios from "../api/axios";

export const useCommentStore = create((set) => ({
  comments: {}, // map pinId -> comments

  fetchComments: async (pinId) => {
    try {
      const res = await axios.get(`/comments/pin?pinId=${pinId}`);
      set((state) => ({ comments: { ...state.comments, [pinId]: res.data } }));
    } catch (err) {
      console.error("Fetching comments failed:", err);
    }
  },

  addComment: async (pinId, text) => {
    try {
      const res = await axios.post(`/comments/add?pinId=${pinId}`, { text });
      set((state) => ({
        comments: {
          ...state.comments,
          [pinId]: [...(state.comments[pinId] || []), res.data],
        },
      }));
    } catch (err) {
      console.error("Adding comment failed:", err);
    }
  },

  deleteComment: async (pinId, commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      set((state) => ({
        comments: {
          ...state.comments,
          [pinId]: state.comments[pinId].filter((c) => c.id !== commentId),
        },
      }));
    } catch (err) {
      console.error("Deleting comment failed:", err);
    }
  },

  updateComment: async (pinId, commentId, newText) => {
    try {
      const res = await axios.put(`/comments/${commentId}`, newText, {
        headers: { "Content-Type": "text/plain" },
      });
      set((state) => ({
        comments: {
          ...state.comments,
          [pinId]: state.comments[pinId].map((c) =>
            c.id === commentId ? res.data : c
          ),
        },
      }));
    } catch (err) {
      console.error("Updating comment failed:", err);
      throw err;
    }
  },
}));
