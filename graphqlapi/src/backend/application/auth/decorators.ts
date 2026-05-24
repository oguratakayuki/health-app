// src/backend/application/auth/decorators.ts
import {
  createParameterDecorator,
  Authorized as TypeGraphQLAuthorized,
} from "type-graphql";
import { GraphQLContext } from "../types/context";
import { AuthenticationError } from "./errors";

/**
 * 現在のユーザーを取得するデコレータ
 * 未認証の場合はエラーをスロー
 */
export function CurrentUser() {
  return createParameterDecorator<GraphQLContext>(({ context }) => {
    if (!context.user) {
      throw new AuthenticationError();
    }
    return context.user;
  });
}

/**
 * 認証チェックデコレータ（オプションでロール指定可能）
 * @param roles - 許可するロール（空の場合は認証済みであればOK）
 */
export function Authorized(roles: ("admin" | "user")[] = []) {
  return TypeGraphQLAuthorized(...roles);
}

/**
 * 管理者専用デコレータ
 */
export function RequireAdmin() {
  return TypeGraphQLAuthorized("admin");
}

/**
 * 任意のユーザー情報を取得（null許容）
 */
export function OptionalCurrentUser() {
  return createParameterDecorator<GraphQLContext>(({ context }) => {
    return context.user || null;
  });
}
