"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => isSupabaseConfigured());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRedirectPath, setLoginRedirectPath] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const openLoginModal = (options = null) => {
    let customPath = null;
    let autoOpen = true;

    if (typeof options === "string") {
      customPath = options;
    } else if (options && typeof options === "object") {
      customPath = options.redirectPath || null;
      if (options.autoOpenBooking !== undefined) {
        autoOpen = !!options.autoOpenBooking;
      }
      if (options.room?.id && typeof window !== "undefined") {
        sessionStorage.setItem("rajmahal_auth_saved_room_id", options.room.id);
      }
    }

    if (typeof window !== "undefined") {
      const currentFullUrl = customPath || (window.location.pathname + window.location.search);
      sessionStorage.setItem("rajmahal_auth_return_url", currentFullUrl);
      if (autoOpen) {
        sessionStorage.setItem("rajmahal_auto_open_booking", "true");
      } else {
        sessionStorage.removeItem("rajmahal_auto_open_booking");
      }
      setLoginRedirectPath(currentFullUrl);
    }

    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setIsRedirecting(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    // Check current auth session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user || null);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, OAuth redirect)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
      if (session?.user) {
        setIsLoginModalOpen(false);
        setIsRedirecting(false);

        // Continue session on the page user clicked from
        if (typeof window !== "undefined") {
          const returnUrl = sessionStorage.getItem("rajmahal_auth_return_url");
          if (returnUrl) {
            sessionStorage.removeItem("rajmahal_auth_return_url");
            const currentFull = window.location.pathname + window.location.search;
            if (returnUrl !== currentFull) {
              router.replace(returnUrl);
            }
          }
        }
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [router]);

  const signInWithGoogle = async (redirectPath) => {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured for OAuth");
      return;
    }
    setIsRedirecting(true);

    let targetPath = redirectPath;
    if (!targetPath && typeof window !== "undefined") {
      targetPath =
        sessionStorage.getItem("rajmahal_auth_return_url") ||
        loginRedirectPath ||
        (window.location.pathname + window.location.search);
    }
    if (!targetPath) targetPath = "/";

    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}${targetPath}` : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });
    if (error) {
      console.error("Google Login Error:", error.message);
      setIsRedirecting(false);
    }
  };

  const signInWithOtp = async (email) => {
    if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/booking` : undefined;
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithOtp,
        signOut,
        isAuthenticated: !!user,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        isRedirecting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
