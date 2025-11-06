import { jwtDecode } from "jwt-decode";

// トークンの中身の型定義（必要に応じて拡張可能）
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

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization header missing" }), {
        status: 401,
      });
    }

    // "Bearer <token>" 形式を想定
    const token = authHeader.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ error: "Invalid Authorization header format" }), {
        status: 400,
      });
    }

    // jwt-decodeでデコード（署名検証はしない）
    const decoded = jwtDecode<CognitoIdTokenPayload>(token);

    // 有効期限チェック（あれば）
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return new Response(JSON.stringify({ error: "Token expired" }), { status: 401 });
    }

    return new Response(
      JSON.stringify({
        message: "User info fetched successfully",
        user: decoded,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error decoding token:", err);
    return new Response(JSON.stringify({ error: "Failed to decode token" }), { status: 400 });
  }
}

