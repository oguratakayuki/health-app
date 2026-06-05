// src/frontend/auth/services/TokenService.ts
import { AUTH_STORAGE_KEYS } from "../constants/auth.constants";
export class TokenService {
  private static instance: TokenService;

  private constructor() {}

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  setTokens(idToken: string, accessToken: string, refreshToken?: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      document.cookie = `accessToken=${accessToken}; path=/; SameSite=Lax`;
      document.cookie = `idToken=${idToken}; path=/; SameSite=Lax`;
    }
  }

  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    }
    return null;
  }

  clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      document.cookie =
        "idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      document.cookie =
        "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
