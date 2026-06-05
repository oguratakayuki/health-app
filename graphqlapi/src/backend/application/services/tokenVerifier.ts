// src/backend/application/services/tokenVerifier.ts
import jwt from "jsonwebtoken";
import { User } from "@/backend/domain/entities/User";
import { ServiceFactory } from "@/backend/application/services/adapters";
import { NextRequest } from "next/server";

export async function verifyIdToken(req: Request | NextRequest): Promise<User | null> {
  try {
    let token: string | null = null;
    // 1. Authorizationヘッダーからトークンを取得（Apollo Client用）
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      console.log("✅ Token found in Authorization header");
    }
    // 2. Cookieからトークンを取得（Server Component用）
    if (!token) {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/idToken=([^;]+)/);
      token = match ? decodeURIComponent(match[1]) : null;
      if (token) {
        console.log("✅ Token found in Cookie");
      }
    }
    if (!token) {
      console.warn("❌ No idToken found in Authorization header or Cookie");
      return null;
    }

    // 3. トークンをデコード
    const decoded: any = jwt.decode(token);
    console.log(`📝 Decoded token - sub: ${decoded?.sub}, email: ${decoded?.email}`);
    if (!decoded?.sub) {
      console.warn("❌ No sub claim in token");
      return null;
    }

    // 4. DB でユーザーを検索
    const userService = ServiceFactory.createUserService();
    let user = await userService.findByCognitoSub(decoded.sub);

    // 5. subで見つからない場合、emailで検索してリンク
    if (!user && decoded.email) {
      console.log(`🔍 User not found by sub, trying email: ${decoded.email}`);
      user = await userService.findByEmail(decoded.email);
      if (user) {
        // 既存ユーザーにsubをリンク
        console.log(`🔗 Linking sub ${decoded.sub} to existing user ${user.email}`);
        user = await userService.updateCognitoSub(decoded.email, decoded.sub);
      }
    }

    if (!user) {
      console.warn(`❌ User not found in DB for sub: ${decoded.sub}`);
      return null;
    }

    console.log(`✅ User verified: ${user.email}, isAdmin: ${user.isAdmin}`);
    return user;
  } catch (error) {
    console.error("❌ verifyIdToken failed:", error);
    return null;
  }
}

export async function verifyIdTokenFromCookie(
  cookieHeader: string,
): Promise<User | null> {
  try {
    const match = cookieHeader.match(/idToken=([^;]+)/);
    const idToken = match ? decodeURIComponent(match[1]) : null;

    if (!idToken) return null;

    const decoded: any = jwt.decode(idToken);
    if (!decoded?.sub) return null;

    const userService = ServiceFactory.createUserService();
    const user = await userService.findByCognitoSub(decoded.sub);
    return user ?? null;
  } catch (error) {
    console.warn("verifyIdTokenFromCookie failed:", error);
    return null;
  }
}

// デバッグ用：トークンの有無をログ出力するミドルウェア関数
export async function debugTokenSource(req: Request) {
  const hasAuthHeader = !!req.headers.get("authorization");
  const hasCookie = !!req.headers.get("cookie")?.includes("idToken");
  console.log(`🔍 Token source debug - Auth Header: ${hasAuthHeader}, Cookie: ${hasCookie}`);
  if (hasAuthHeader) {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.split(" ")[1];
    console.log(`📝 Auth Header token preview: ${token?.substring(0, 50)}...`);
  }
}
