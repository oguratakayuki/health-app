// src/frontend/auth/types/session.types.ts
import { AuthUser } from "./auth.types";

/**
 * セッション情報の基本インターフェース
 */
export interface SessionData {
  /** セッションID */
  id: string;
  /** ユーザー情報 */
  user: AuthUser;
  /** アクセストークン */
  accessToken: string;
  /** IDトークン */
  idToken: string;
  /** リフレッシュトークン（オプション） */
  refreshToken?: string;
  /** セッション作成時刻 */
  createdAt: Date;
  /** セッション有効期限 */
  expiresAt: Date;
  /** 最終アクティブ時刻 */
  lastActiveAt: Date;
  /** セッションの状態 */
  status: SessionStatus;
}

/**
 * セッションの状態
 */
export type SessionStatus =
  | "active" // アクティブ
  | "expired" // 期限切れ
  | "revoked" // 無効化（ログアウト）
  | "refreshing"; // リフレッシュ中

/**
 * セッション設定
 */
export interface SessionConfig {
  /** セッションタイムアウト（ミリ秒） */
  timeout: number;
  /** リフレッシュ閾値（ミリ秒）- この時間前にリフレッシュを試行 */
  refreshThreshold: number;
  /** 最大同時セッション数 */
  maxConcurrentSessions: number;
  /** セッション永続化するか */
  persistent: boolean;
}

/**
 * セッションリフレッシュリクエスト
 */
export interface SessionRefreshRequest {
  /** リフレッシュトークン */
  refreshToken: string;
  /** 現在のアクセストークン（オプション） */
  currentAccessToken?: string;
}

/**
 * セッションリフレッシュレスポンス
 */
export interface SessionRefreshResponse {
  /** 新しいアクセストークン */
  accessToken: string;
  /** 新しいIDトークン */
  idToken: string;
  /** 新しいリフレッシュトークン（オプション） */
  refreshToken?: string;
  /** 新しい有効期限 */
  expiresAt: Date;
}

/**
 * セッション検証結果
 */
export interface SessionValidationResult {
  /** 有効かどうか */
  isValid: boolean;
  /** 無効な場合の理由 */
  reason?: SessionInvalidReason;
  /** 新しいセッション情報（リフレッシュ成功時） */
  newSession?: SessionData;
}

/**
 * セッション無効理由
 */
export type SessionInvalidReason =
  | "expired" // 期限切れ
  | "revoked" // 無効化された
  | "malformed" // トークン形式不正
  | "signature_invalid" // 署名無効
  | "user_not_found" // ユーザーが見つからない
  | "concurrent_limit"; // 同時セッション数超過

/**
 * セッション情報（軽量版 - API通信などで使用）
 */
export interface SessionInfo {
  userId: string;
  email: string;
  isAdmin: boolean;
  sessionId: string;
  expiresAt: Date;
}

/**
 * アクティブセッション情報（管理者向け）
 */
export interface ActiveSession {
  sessionId: string;
  userId: string;
  email: string;
  lastActiveAt: Date;
  createdAt: Date;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * セッションイベント
 */
export interface SessionEvent {
  type: SessionEventType;
  sessionId: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export type SessionEventType =
  | "session_created"
  | "session_refreshed"
  | "session_expired"
  | "session_revoked"
  | "session_conflict"; // 同時セッション競合
