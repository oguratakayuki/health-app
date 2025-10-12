import type { NextApiRequest, NextApiResponse } from "next";
import { jwtDecode } from "jwt-decode";

// トークンの中身の型定義（必要に応じて拡張できます）
interface CognitoIdTokenPayload {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  aud?: string;
  iss?: string;
  exp?: number;
  iat?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    // "Bearer <token>" 形式を想定
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(400).json({ error: "Invalid Authorization header format" });
    }

    // jwt-decodeでデコード（署名検証はしない）
    const decoded = jwtDecode<CognitoIdTokenPayload>(token);

    // 有効期限チェック（あれば）
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ error: "Token expired" });
    }

    return res.status(200).json({
      message: "User info fetched successfully",
      user: decoded,
    });
  } catch (err: any) {
    console.error("Error decoding token:", err);
    return res.status(400).json({ error: "Failed to decode token" });
  }
}

