"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { auth, googleProvider, signInWithPopup } from "../lib/firebase";
import { useNotifications } from "./NotificationContext";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  login: (token: string, userData: User) => void;
  loginWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = Cookies.get("token");
    const guestStatus = Cookies.get("isGuest");

    if (guestStatus === "true") {
      setIsGuest(true);
      setLoading(false);
    } else if (token) {
      // Validate token with backend
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            Cookies.remove("token");
          }
        })
        .catch(() => {
          Cookies.remove("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const { addNotification } = useNotifications();

  const login = (token: string, userData: User) => {
    Cookies.set("token", token, { expires: 7 });
    Cookies.remove("isGuest");
    setUser(userData);
    setIsGuest(false);
    
    addNotification({
      title: "Welcome to VedaAI!",
      message: `You have successfully signed in as ${userData.name || userData.email}.`,
      type: "success"
    });
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await result.user.getIdToken();

      // Send Firebase token to our backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseToken }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token, data.user);
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
  };

  const continueAsGuest = () => {
    Cookies.set("isGuest", "true", { expires: 1 }); // 1 day guest session
    Cookies.remove("token");
    setIsGuest(true);
    setUser(null);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("isGuest");
    setUser(null);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isGuest, loading, login, loginWithGoogle, continueAsGuest, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
