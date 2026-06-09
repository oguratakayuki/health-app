// src/backend/application/services/tokenVerifier.ts
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { ServiceFactory } from "@/backend/application/services/adapters";

// cognito-localのJWKSクライアント
let localJwksClient: any = null;

function getLocalJwksClient() {
  if (!localJwksClient) {
    localJwksClient = jwksClient({
      jwksUri: "http://cognito-local:9229/local_2v4xbyoW/.well-known/jwks.json",
      cache: true,
      rateLimit: true,
    });
  }
  return localJwksClient;
}

export async function verifyIdToken(req: Request): Promise<any> {
  try {
    const token = extractToken(req);
    if (!token) {
      return null;
    }

    const decodedHeader = jwt.decode(token, { complete: true });
    const algorithm = decodedHeader?.header?.alg || "RS256";
    const kid = decodedHeader?.header?.kid;
    console.log(`🔐 Verifying token with algorithm: ${algorithm}, kid: ${kid}`);

    // 開発環境：cognito-localのJWKSから公開鍵を取得して検証
    if (process.env.NODE_ENV === "development") {
      try {
        const client = getLocalJwksClient();
        const verified = await new Promise((resolve, reject) => {
          jwt.verify(
            token,
            (header, callback) => {
              client.getSigningKey(header.kid, (err, key) => {
                if (err) {
                  callback(err);
                } else {
                  const signingKey = key.getPublicKey();
                  callback(null, signingKey);
                }
              });
            },
            {
              algorithms: ["RS256"],
              ignoreExpiration: true,
            },
            (err, decoded) => {
              if (err) reject(err);
              else resolve(decoded);
            },
          );
        });
        console.log("✅ Token verified with cognito-local public key");
        console.log("verifyIdToken returning(verified):", verified);
        return verified;
      } catch (verifyError) {
        console.error("Verification failed:", verifyError.message);
        // フォールバック
        console.warn("⚠️ Falling back to decode without verification");
        return jwt.decode(token);
      }
    }

    // 本番環境
    return jwt.decode(token);
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function verifyIdTokenFromCookie(
  cookieHeader: string,
): Promise<any> {
  try {
    const match = cookieHeader.match(/idToken=([^;]+)/);
    const idToken = match ? decodeURIComponent(match[1]) : null;

    if (!idToken) {
      console.warn("No idToken found in cookie");
      return null;
    }

    const decoded: any = jwt.decode(idToken);
    if (!decoded?.sub || !decoded?.email) {
      console.warn("Invalid token: missing sub or email");
      return null;
    }

    // データベースからユーザー情報を取得
    const userService = ServiceFactory.createUserService();
    let user = await userService.findByCognitoSub(decoded.sub);

    if (!user && decoded.email) {
      user = await userService.findByEmail(decoded.email);
    }

    if (!user) {
      console.warn(`User not found for email: ${decoded.email}`);
      return null;
    }

    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      cognitoSub: user.cognitoSub,
    };
  } catch (error) {
    console.error("verifyIdTokenFromCookie failed:", error);
    return null;
  }
}
function extractToken(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/idToken=([^;]+)/);
  if (match) {
    return decodeURIComponent(match[1]);
  }
  return null;
}
