import { verifyIdToken } from "./services/tokenVerifier";

export interface GraphQLContext {
  user?: any;
}

export async function createContext(req: Request): Promise<GraphQLContext> {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/idToken=([^;]+)/);
  const idToken = match ? match[1] : null;

  if (!idToken) return { user: null };

  try {
    const user = await verifyIdToken(req);
    return { user };
  } catch (e) {
    console.warn("Invalid token:", e);
    return { user: null };
  }
}

