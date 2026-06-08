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
  // クッキーからトークンを取得
  private getTokenFromCookie(tokenName: string): string | null {
    if (typeof window === "undefined") return null;
    const cookies = document.cookie.split(";");
    console.log("cookies");
    console.log(cookies);
    const targetCookie = cookies.find((c) =>
      c.trim().startsWith(`${tokenName}=`),
    );
    if (targetCookie) {
      return decodeURIComponent(targetCookie.split("=")[1]);
    }
    return null;
  }
  // アクセストークンを取得（クッキー優先、次にlocalStorage）
  getAccessToken(): string | null {
    // まずクッキーから取得
    let token = this.getTokenFromCookie("accessToken");
    // クッキーになければlocalStorageから
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    }
    console.log("TokenService.getAccessToken:", {
      source: token
        ? this.getTokenFromCookie("accessToken")
          ? "cookie"
          : "localStorage"
        : "none",
      hasToken: !!token,
    });
    return token;
  }
  // IDトークンを取得
  getIdToken(): string | null {
    return this.getTokenFromCookie("idToken");
  }
  // トークンを設定（クッキーとlocalStorageの両方に）
  setTokens(idToken: string, accessToken: string, refreshToken?: string): void {
    if (typeof window !== "undefined") {
      // localStorage にも保存（バックアップ）
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      console.log("TokenService.setTokens:", {
        hasIdToken: !!idToken,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
      });
    }
  }
  // トークンの期限チェック
  isTokenExpired(token: string): boolean {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error(
          "Invalid token format - wrong number of parts:",
          parts.length,
        );
        return true;
      }
      const payload = JSON.parse(atob(parts[1]));
      if (!payload.exp) {
        console.error("Invalid token format - no exp field");
        return true;
      }
      const exp = payload.exp * 1000;
      const now = Date.now();
      const expired = exp < now;
      console.log("Token expiry check:", {
        exp: new Date(exp),
        now: new Date(now),
        expired,
        timeLeftMinutes: expired ? 0 : Math.round((exp - now) / 1000 / 60),
      });
      return expired;
    } catch (error) {
      console.error("isTokenExpired error:", error);
      return true;
    }
  }
  // トークンをクリア
  clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      // クッキーも削除
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      document.cookie =
        "idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      document.cookie =
        "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
  }
}
