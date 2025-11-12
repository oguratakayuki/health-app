
import { jwtDecode } from "jwt-decode";

export interface DecodedUser {
  sub: string;
  email?: string;
  [key: string]: any;
}

export async function verifyIdToken(req: Request): Promise<DecodedUser | null> {
  try {
    let token: string | null = null;

    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "");
    }

    if (!token) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/idToken=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) return null;

    const decoded: any = jwtDecode(token);
    if (!decoded.sub) return null;

    return {
      sub: decoded.sub,
      email: decoded.email,
      ...decoded,
    };
  } catch (error) {
    console.error("❌ Failed to verify idToken:", error);
    return null;
  }
}
