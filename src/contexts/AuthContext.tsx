"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, use } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  [key: string]: any;
}

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Inisialisasi dari localStorage Supabase saat mount
  useEffect(() => {
    const supabaseKey = Object.keys(localStorage).find(
      (key) => key.includes('-auth-token')
    );
    if (supabaseKey) {
      const value = localStorage.getItem(supabaseKey);
      if (value) {
        try {
          const parsed = JSON.parse(value);
          let user = parsed.user || null;
          if (user && user.user_metadata) {
            user = { ...user, fullName: user.user_metadata.full_name, phoneNumber: user.phone || user.user_metadata.phone_number};
          }
          setAccessToken(parsed.access_token || null);
          setUser(user);
        } catch (e) {
          setAccessToken(null);
          setUser(null);
        }
      }
    }
  }, []);

  const setAuth = (token: string, user: User) => {
    setAccessToken(token);
    setUser(user);
    // Tidak perlu simpan ke localStorage, Supabase sudah handle
  };

  const logout = async () => {
    const toastId = toast.loading("Memproses...");
    await supabase.auth.signOut();
    setAccessToken(null);
    setUser(null);
    toast.success("Berhasil logout!", { id: toastId });
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 