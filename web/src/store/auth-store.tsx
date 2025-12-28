import { create } from "zustand";
import { apiUrl } from "@/lib/api";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  // isAuthenticated computed olarak user'dan türetilecek

  // Auth operations
  checkAuth: () => Promise<boolean>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean }>;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  user: null,
  loading: true,
  error: null,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,

  checkAuth: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(apiUrl("/api/auth/me"), {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          set({
            user: data.data,
            loading: false,
            error: null,
          });
          return true;
        }
      }

      // Not authenticated
      set({
        user: null,
        loading: false,
      });
      return false;
    } catch (err) {
      console.error("Auth check failed:", err);
      set({
        user: null,
        loading: false,
        error: "Kimlik doğrulama başarısız",
      });
      return false;
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login başarılı, kullanıcı bilgilerini al
        await get().checkAuth();
        return { success: true };
      } else if (data.error?.code === "EMAIL_NOT_VERIFIED") {
        set({ loading: false });
        return {
          success: false,
          requiresVerification: true,
          error: data.error?.message,
        };
      } else {
        set({
          loading: false,
          error: data.error?.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
        });
        return {
          success: false,
          error: data.error?.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
        };
      }
    } catch (err) {
      const errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
      set({
        loading: false,
        error: errorMessage,
      });
      console.error("Login error:", err);
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  signUp: async (name: string, email: string, password: string) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        set({ loading: false });
        return { success: true };
      } else {
        set({
          loading: false,
          error: data.error?.message || "Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.",
        });
        return {
          success: false,
          error: data.error?.message || "Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.",
        };
      }
    } catch (err) {
      const errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
      set({
        loading: false,
        error: errorMessage,
      });
      console.error("Sign up error:", err);
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  logout: async () => {
    try {
      const response = await fetch(apiUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Logout request failed");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      get().reset();
    }
  },

  reset: () => set(initialState),
}));

// Computed selector - isAuthenticated
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user);