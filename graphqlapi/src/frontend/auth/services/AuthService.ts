// src/frontend/auth/services/AuthService.ts
import { ApolloClient } from "@apollo/client";
import { TokenService } from "./TokenService";
import { AUTH_STORAGE_KEYS } from "../constants/auth.constants";

export class AuthService {
  constructor(
    private apolloClient: ApolloClient<object>,
    private tokenService: TokenService = TokenService.getInstance(),
  ) {}
  async signup(email: string, password: string, name: string): Promise<void> {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }
    // サインアップ後はログインしない（確認コードが必要なため）
    // トークンの設定などは行わない
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      const data = await response.json();
      // クッキーはサーバー側で設定されるので、localStorageのみ更新
      this.tokenService.setTokens(
        data.idToken,
        data.accessToken,
        data.refreshToken,
      );
      console.log("Login successful, tokens saved");
      await this.apolloClient.resetStore();
    } catch (error) {
      console.error("Login service error:", error);
      throw error;
    }
  }
  async logout(): Promise<void> {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      this.tokenService.clearTokens();
      await this.apolloClient.resetStore();
    }
  }
  async refreshSession(): Promise<boolean> {
    const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) return false;
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (response.ok) {
        const data = await response.json();
        this.tokenService.setTokens(
          data.idToken,
          data.accessToken,
          data.refreshToken,
        );
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
    return false;
  }
}
