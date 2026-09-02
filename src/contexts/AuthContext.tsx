import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { login as apiLogin, setTokens, clearTokens, getTokens, apiRequest } from "@/lib/api";

export type UserRole = "SUPERADMIN" | "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  company?: number;
  branch?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user from API
  const fetchCurrentUser = useCallback(async () => {
    try {
      const userData = await apiRequest<User>("/users/me/");
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      // If fetch fails, clear tokens and user
      clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const tokens = getTokens();
    if (tokens) {
      // Try to get user from localStorage first (for quick load)
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // Invalid stored data
        }
      }
      // Then fetch fresh data from API
      fetchCurrentUser();
    }
    setIsLoading(false);
  }, [fetchCurrentUser]);

  const loginFn = useCallback(async (username: string, password: string) => {
    const data = await apiLogin(username, password);
    setTokens({ access: data.access, refresh: data.refresh });

    // After login, fetch user data from /users/me/
    try {
      const userData = await apiRequest<User>("/users/me/");
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      // Fallback to data from login response
      const userData: User = data.user || {
        id: 0,
        username,
        email: "",
        role: "EMPLOYEE" as UserRole,
        first_name: username,
        last_name: "",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login: loginFn, logout, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
