// src/services/tokenVerifier.ts
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";

const COGNITO_JWKS_URL = process.env.COGNITO_JWKS_URL || "http://cognito-local:9229/jwks.json";

let cachedJwks: Record<string, any> | null = null;

async function getJwks() {
  if (!cachedJwks) {
    const res = await fetch(COGNITO_JWKS_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch JWKs: ${res.statusText}`);
    }
    cachedJwks = await res.json();
  }
  return cachedJwks;
}

/**
 * cookieからidTokenを取得してJWT検証
 */
export async function verifyIdToken(req: Request): Promise<any | null> {
  try {
    // CookieからidTokenを抽出
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/idToken=([^;]+)/);
    const idToken = match ? decodeURIComponent(match[1]) : null;

    if (!idToken) {
      console.warn("No idToken found in cookie");
      return null;
    }

    const jwks = await getJwks();
    if (jwks === null) {
      throw new Error("Failed to retrieve JWKS."); 
    }

    const decodedHeader = jwt.decode(idToken, { complete: true })?.header;

    if (!decodedHeader || !decodedHeader.kid) {
      throw new Error("Invalid token header");
    }

    const jwk = jwks.keys.find((key: any) => key.kid === decodedHeader.kid);
    if (!jwk) {
      throw new Error("Matching JWK not found");
    }

    const pem = jwkToPem(jwk);
    const payload = jwt.verify(idToken, pem, { algorithms: ["RS256"] });

    return payload;
  } catch (error) {
    console.warn("verifyIdToken failed:", error);
    return null;
  }
}

