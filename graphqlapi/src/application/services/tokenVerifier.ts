// src/services/tokenVerifier.ts
import jwt from "jsonwebtoken";
import { User } from "@/domain/entities/User";
import { ServiceFactory } from '@/application/services/adapters';

export async function verifyIdToken(req: Request): Promise<User | null> {
  try {
    // CookieからidTokenを抽出
    console.log(`AAAA`)
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/idToken=([^;]+)/);
    const idToken = match ? decodeURIComponent(match[1]) : null;
    console.log(`AAAA 1`)

    if (!idToken) {
      console.warn("No idToken found in cookie");
      return null;
    }
    console.log(`AAAA 2`)

    // ローカル開発用: 署名検証せずにデコード
    const decoded: any = jwt.decode(idToken);
    console.log(`decoded.sub ${decoded.sub}`)
    if (!decoded?.sub) return null;

    // DB でユーザーを検索
    const userService = ServiceFactory.createUserService();
    const user = await userService.findByCognitoSub(decoded.sub);

    if (!user) {
      console.log(`AAAA 3`)
      console.warn(`User not found in DB: ${decoded.sub}`);
      return null;
    }

    console.log(`AAAA 4`)
    return user;
  } catch (error) {
    console.warn("verifyIdToken failed:", error);
    return null;
  }
}

export async function verifyIdTokenFromCookie(cookieHeader: string): Promise<User | null> {
  try {
    console.log('BBBB')
    console.log(cookieHeader)
    const match = cookieHeader.match(/idToken=([^;]+)/);
    const idToken = match ? decodeURIComponent(match[1]) : null;

    if (!idToken) return null;

    const decoded: any = jwt.decode(idToken);
    if (!decoded?.sub) return null;

    const userService = ServiceFactory.createUserService();
    const user = await userService.findByCognitoSub(decoded.sub);
    return user ?? null;
  } catch (error) {
    console.warn("verifyIdToken failed:", error);
    return null;
  }
}

