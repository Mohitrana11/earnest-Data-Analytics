// lib/auth.ts - Auth Helper
"use client";

import { jwtDecode } from "jwt-decode";
import api from "./api";

interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
}

export const getAccessToken = (): string | null => {
  return typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem("accessToken", token);
};

export const removeAccessToken = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};

export const getUserFromToken = (token: string) => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch {
    return null;
  }
};

// Auto-refresh token
export const refreshToken = async (): Promise<boolean> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    const response = await api.post("/auth/refresh", { refreshToken });
    const { accessToken } = response.data;

    setAccessToken(accessToken);
    return true;
  } catch {
    removeAccessToken();
    return false;
  }
};
