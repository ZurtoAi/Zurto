// Auth Service with automatic JWT token refresh

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

interface UserInfo {
  userId: string;
  username: string;
  teamId: string;
  teamName?: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  tokens: AuthTokens | null;
}

class AuthService {
  private static instance: AuthService;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners: Set<(state: AuthState) => void> = new Set();

  private state: AuthState = {
    isAuthenticated: false,
    user: null,
    tokens: null,
  };

  private constructor() {
    // Initialize from localStorage
    this.loadFromStorage();
    // Start refresh timer if authenticated
    if (this.state.isAuthenticated) {
      this.scheduleTokenRefresh();
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  private loadFromStorage(): void {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const expiresAt = localStorage.getItem("tokenExpiresAt");
      const userJson = localStorage.getItem("user");

      if (accessToken && refreshToken && userJson) {
        const user = JSON.parse(userJson) as UserInfo;
        const expiresIn = expiresAt
          ? Math.max(0, (parseInt(expiresAt) - Date.now()) / 1000)
          : 0;

        this.state = {
          isAuthenticated: true,
          user,
          tokens: { accessToken, refreshToken, expiresIn },
        };
      }
    } catch (error) {
      console.error("Failed to load auth state from storage:", error);
      this.clearStorage();
    }
  }

  private saveToStorage(): void {
    if (this.state.tokens && this.state.user) {
      localStorage.setItem("accessToken", this.state.tokens.accessToken);
      localStorage.setItem("refreshToken", this.state.tokens.refreshToken);
      localStorage.setItem("token", this.state.tokens.accessToken); // Legacy support
      localStorage.setItem(
        "tokenExpiresAt",
        String(Date.now() + this.state.tokens.expiresIn * 1000)
      );
      localStorage.setItem("user", JSON.stringify(this.state.user));
      localStorage.setItem("username", this.state.user.username);
    }
  }

  private clearStorage(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiresAt");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
  }

  // Schedule automatic token refresh
  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!this.state.tokens) return;

    // Refresh 1 minute before expiry
    const refreshInMs = Math.max(0, (this.state.tokens.expiresIn - 60) * 1000);

    console.log(
      `🔄 Token refresh scheduled in ${Math.round(refreshInMs / 1000)}s`
    );

    this.refreshTimer = setTimeout(() => {
      this.refreshAccessToken();
    }, refreshInMs);
  }

  // Refresh the access token
  async refreshAccessToken(): Promise<boolean> {
    if (!this.state.tokens?.refreshToken) {
      console.warn("No refresh token available");
      return false;
    }

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: this.state.tokens.refreshToken }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        this.state.tokens = {
          ...this.state.tokens,
          accessToken: data.data.accessToken,
          expiresIn: data.data.expiresIn,
        };
        this.saveToStorage();
        this.scheduleTokenRefresh();
        this.notify();
        console.log("✅ Token refreshed successfully");
        return true;
      } else {
        console.error("Token refresh failed:", data.error);
        this.logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      // Don't logout on network error, let user retry
      return false;
    }
  }

  // Login
  async login(
    username: string,
    teamToken: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, teamToken }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const { accessToken, refreshToken, expiresIn, ...userInfo } = data.data;

        this.state = {
          isAuthenticated: true,
          user: userInfo as UserInfo,
          tokens: { accessToken, refreshToken, expiresIn },
        };

        this.saveToStorage();
        this.scheduleTokenRefresh();
        this.notify();

        console.log("✅ Login successful");
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error" };
    }
  }

  // Logout
  async logout(): Promise<void> {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    // Notify backend
    if (this.state.tokens?.refreshToken) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            refreshToken: this.state.tokens.refreshToken,
          }),
        });
      } catch (error) {
        console.warn("Logout notification failed:", error);
      }
    }

    this.state = {
      isAuthenticated: false,
      user: null,
      tokens: null,
    };

    this.clearStorage();
    this.notify();
    console.log("✅ Logged out");
  }

  // Get current access token
  getAccessToken(): string | null {
    return this.state.tokens?.accessToken || null;
  }

  // Get current user
  getUser(): UserInfo | null {
    return this.state.user;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  // Check if token is about to expire (within 5 minutes)
  isTokenExpiringSoon(): boolean {
    if (!this.state.tokens) return true;
    return this.state.tokens.expiresIn < 300; // 5 minutes
  }

  // Verify current token with backend
  async verifyToken(): Promise<boolean> {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const response = await fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        return true;
      } else if (data.code === "TOKEN_EXPIRED") {
        // Try to refresh
        return await this.refreshAccessToken();
      }
      return false;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  }

  // Create authenticated fetch wrapper
  async authenticatedFetch(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    // Check if token needs refresh first
    if (this.isTokenExpiringSoon()) {
      await this.refreshAccessToken();
    }

    const token = this.getAccessToken();
    const headers = new Headers(options.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, { ...options, headers });

    // Handle 401 by trying to refresh
    if (response.status === 401) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry the request with new token
        headers.set("Authorization", `Bearer ${this.getAccessToken()}`);
        return fetch(url, { ...options, headers });
      }
    }

    return response;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// React hook for auth state
import { useState, useEffect } from "react";

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: authService.isAuthenticated(),
    user: authService.getUser(),
    tokens: null,
  });

  useEffect(() => {
    return authService.subscribe(setState);
  }, []);

  return {
    ...state,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    getAccessToken: authService.getAccessToken.bind(authService),
    refreshToken: authService.refreshAccessToken.bind(authService),
  };
}
