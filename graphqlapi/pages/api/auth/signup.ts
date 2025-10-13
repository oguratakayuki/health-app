// pages/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { cognitoService } from "../../../src/services/cognitoService";
// データベース連携のためのTypeORM関連のインポート（後述）
import { userService } from "../../../src/services/userService";
import { initializeDataSource } from "../../../src/data-source";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await initializeDataSource(); 
  } catch (dbError) {
    console.error("Database initialization failed:", dbError);
    return res.status(500).json({ error: "Server configuration error (DB init)." });
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required" });
  }

  try {
    // Cognitoへのサインアップ
    console.log('HERE')
    await cognitoService.signUp(email, password, name);
    console.log('HERE2')
    // MySQL DBへの連携
    const createdUser = await userService.createUser(email, name);
    return res.status(200).json({
      message: "Sign up successful. Confirmation code sent. DB record created.",
      userId: createdUser.id, // DBのIDを返す
      nextStep: "CONFIRMATION_REQUIRED",
    });
  } catch (error: any) {
    console.error("Cognito Sign Up Error:", error.message);
    // Cognitoのエラーに応じて適切なステータスコードを返す
    return res.status(400).json({ error: error.message || "Sign up failed" });
  }
}
