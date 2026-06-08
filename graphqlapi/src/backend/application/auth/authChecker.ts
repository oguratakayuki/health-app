// src/backend/application/auth/authChecker.ts
import { AuthChecker } from "type-graphql";
import { GraphQLContext } from "../types/context";

export const authChecker: AuthChecker<GraphQLContext> = (
  { context },
  roles,
) => {
  console.log("authChecker called, user:", context.user);
  // 未認証の場合
  if (!context.user) {
    console.log("authChecker: No user in context");
    return false;
  }
  // ロールチェック（rolesが空の場合は認証されていればOK）
  if (roles.length === 0) {
    return true;
  }
  // 管理者ロールのチェック
  if (roles.includes("admin") && !context.user.isAdmin) {
    return false;
  }
  // 一般ユーザーロールのチェック
  if (roles.includes("user") && context.user.isAdmin === false) {
    return true;
  }
  console.log("authChecker: Authentication successful");
  return true;
};
