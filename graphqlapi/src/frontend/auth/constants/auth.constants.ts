// src/frontend/auth/constants/auth.constants.ts
export const AUTH_STORAGE_KEYS = {
  TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "auth_user",
  PERMISSIONS: "auth_permissions",
} as const;

export const AUTH_ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export const AUTH_CONFIG = {
  SESSION_TIMEOUT: 3600000, // 1時間
  REFRESH_THRESHOLD: 300000, // 5分前からリフレッシュ
  MAX_RETRY_ATTEMPTS: 3,
} as const;
