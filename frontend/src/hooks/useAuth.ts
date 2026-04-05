"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getAccessToken,
  refreshToken,
  removeAccessToken,
  getUserFromToken,
  isTokenExpired,
} from "../lib/auth";
import api from "../lib/api";
import toast from "react-hot-toast";

export interface User {
  id: string;
  username: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const validateToken = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        removeAccessToken();
        setUser(null);
        if (typeof window !== "undefined") {
          router.push("/auth/login");
        }
        return;
      }
    }

    const userData = getUserFromToken(getAccessToken()!);
    if (userData) {
      // ✅ Fetch complete user data from API
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch {
        setUser({
          id: userData.userId,
          username: "User",
          email: "user@example.com",
        });
      }
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = getAccessToken();
      if (token) {
        await api.post(
          "/auth/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      removeAccessToken();
      setUser(null);
      if (typeof window !== "undefined") {
        router.push("/auth/login");
      }
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !loading,
    validateToken,
  };
};
