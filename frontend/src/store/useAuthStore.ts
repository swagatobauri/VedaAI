import { create } from 'zustand';
import Cookies from 'js-cookie';
import { auth, googleProvider, signInWithPopup } from "../lib/firebase";
import { useNotificationStore } from './useNotificationStore';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  login: (token: string, userData: User) => void;
  loginWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isGuest: false,
  loading: true,

  checkSession: async () => {
    set({ loading: true });
    const token = Cookies.get("token");
    const guestStatus = Cookies.get("isGuest");

    if (guestStatus === "true") {
      set({ isGuest: true, loading: false });
    } else if (token) {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.user) {
          set({ user: data.user });
        } else {
          Cookies.remove("token");
        }
      } catch (err) {
        Cookies.remove("token");
      } finally {
        set({ loading: false });
      }
    } else {
      set({ loading: false });
    }
  },

  login: (token: string, userData: User) => {
    Cookies.set("token", token, { expires: 7 });
    Cookies.remove("isGuest");
    set({ user: userData, isGuest: false });
    
    useNotificationStore.getState().addNotification({
      title: "Welcome to VedaAI!",
      message: `You have successfully signed in as ${userData.name || userData.email}.`,
      type: "success"
    });
  },

  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await result.user.getIdToken();

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseToken }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        get().login(data.token, data.user);
      } else {
        console.error("Backend Google Auth Error:", data);
        alert("Google Auth failed on the backend.");
      }
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      if (error.message?.includes("not configured")) {
        alert(error.message);
      } else {
        alert("Google Login failed. Make sure your Firebase keys are correct.");
      }
    }
  },

  continueAsGuest: () => {
    Cookies.set("isGuest", "true", { expires: 1 });
    Cookies.remove("token");
    set({ isGuest: true, user: null });
  },

  logout: () => {
    Cookies.remove("token");
    Cookies.remove("isGuest");
    set({ user: null, isGuest: false });
  }
}));
