import create from "zustand";
import { persist } from "zustand/middleware";
import { authClient, signIn, signOut } from "./auth";

// Define the shape of the auth state
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  checkSession: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// Zustand store for authentication state
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      // Check if user is logged in on app start
      checkSession: async () => {
        set({ loading: true, error: null });
        try {
          const session = await authClient.getSession();
          if (session?.user) {
            set({ user: session.user as AuthUser, loading: false });
          } else {
            set({ user: null, loading: false });
          }
        } catch (e: any) {
          set({ error: e.message || "Failed to check session", loading: false });
        }
      },
      // Login with Google
      login: async () => {
        set({ loading: true, error: null });
        try {
          await signIn.social({ provider: "google", callbackURL: "/" });
          const session = await authClient.getSession();
          set({ user: session?.user as AuthUser, loading: false });
        } catch (e: any) {
          set({ error: e.message || "Login failed", loading: false });
        }
      },
      // Logout
      logout: async () => {
        set({ loading: true, error: null });
        try {
          await signOut();
          set({ user: null, loading: false });
        } catch (e: any) {
          set({ error: e.message || "Logout failed", loading: false });
        }
      },
    }),
    {
      name: "auth-storage", // persist key
      partialize: (state) => ({ user: state.user }), // only persist user
    }
  )
); 