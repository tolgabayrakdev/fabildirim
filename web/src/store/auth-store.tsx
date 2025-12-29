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
  ) => Promise<{
    success: boolean;
    error?: string;
    emailRequired?: boolean;
    smsRequired?: boolean;
    email?: string;
    maskedPhone?: string;
  }>;
  verifyEmailOtp: (
    email: string,
    code: string
  ) => Promise<{
    success: boolean;
    error?: string;
    requiresSmsVerification?: boolean;
    maskedPhone?: string;
  }>;
  verifySmsOtp: (
    email: string,
    code: string
  ) => Promise<{ success: boolean; error?: string }>;
  resendEmailVerification: (
    email: string
  ) => Promise<{ 
    success: boolean; 
    error?: string; 
    message?: string;
    remainingSeconds?: number;
  }>;
  resendSmsVerification: (
    email: string
  ) => Promise<{
    success: boolean;
    error?: string;
    message?: string;
    maskedPhone?: string;
  }>;
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
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
        // Eğer emailRequired veya smsRequired varsa, doğrulama gerekiyor
        if (data.data?.emailRequired) {
          set({ loading: false });
          return {
            success: false,
            emailRequired: true,
            email: data.data.email,
          };
        }
        if (data.data?.smsRequired) {
          set({ loading: false });
          return {
            success: false,
            smsRequired: true,
            email: data.data.email,
            maskedPhone: data.data.maskedPhone,
          };
        }
        // Login başarılı, kullanıcı bilgilerini al
        await get().checkAuth();
        return { success: true };
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

  verifyEmailOtp: async (email: string, code: string) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(apiUrl("/api/auth/verify-email-otp"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Eğer SMS doğrulaması gerekiyorsa
        if (data.data?.requiresSmsVerification) {
          set({ loading: false });
          return {
            success: true,
            requiresSmsVerification: true,
            maskedPhone: data.data.maskedPhone,
          };
        }
        // Her ikisi de doğrulandı, giriş yap
        await get().checkAuth();
        return { success: true };
      } else {
        set({
          loading: false,
          error: data.error?.message || "Doğrulama kodu geçersiz.",
        });
        return {
          success: false,
          error: data.error?.message || "Doğrulama kodu geçersiz.",
        };
      }
    } catch (err) {
      const errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
      set({
        loading: false,
        error: errorMessage,
      });
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  verifySmsOtp: async (email: string, code: string) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(apiUrl("/api/auth/verify-sms-otp"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // SMS doğrulandı, giriş yap
        await get().checkAuth();
        return { success: true };
      } else {
        set({
          loading: false,
          error: data.error?.message || "Doğrulama kodu geçersiz.",
        });
        return {
          success: false,
          error: data.error?.message || "Doğrulama kodu geçersiz.",
        };
      }
    } catch (err) {
      const errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
      set({
        loading: false,
        error: errorMessage,
      });
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  resendEmailVerification: async (email: string) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(apiUrl("/api/auth/resend-email-verification"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        set({ loading: false });
        return { 
          success: true, 
          message: data.message,
          remainingSeconds: data.data?.remainingSeconds || 180
        };
      } else {
        set({
          loading: false,
          error: data.error?.message || "E-posta gönderilemedi.",
        });
        return {
          success: false,
          error: data.error?.message || "E-posta gönderilemedi.",
        };
      }
    } catch (err) {
      const errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
      set({
        loading: false,
        error: errorMessage,
      });
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  resendSmsVerification: async (email: string) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(apiUrl("/api/auth/resend-sms-verification"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        set({ loading: false });
        return {
          success: true,
          message: data.message,
          maskedPhone: data.data?.maskedPhone,
        };
      } else {
        set({
          loading: false,
          error: data.error?.message || "SMS gönderilemedi.",
        });
        return {
          success: false,
          error: data.error?.message || "SMS gönderilemedi.",
        };
      }
    } catch (err) {
      const errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
      set({
        loading: false,
        error: errorMessage,
      });
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  signUp: async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string
  ) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          password,
        }),
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