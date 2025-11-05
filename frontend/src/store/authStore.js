import { create } from "zustand";
import { persist } from "zustand/middleware";
import socket from "../services/socket";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
        // Connect socket when user logs in
        if (user?._id) {
          socket.connect(user._id);
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Disconnect socket when user logs out
        socket.disconnect();
      },

      updateProfile: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export { useAuthStore };
