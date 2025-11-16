import { cookies } from "next/headers";
import { verifyIdTokenFromCookie } from "../services/tokenVerifier";

export async function getUserSession() {
  const cookieHeader = cookies().toString();
  const user = await verifyIdTokenFromCookie(cookieHeader);

  return user; // user が null の場合は未ログイン扱い
}
