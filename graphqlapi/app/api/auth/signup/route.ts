// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";

import { ServiceFactory } from '@/application/services/adapters';
// データベース連携のためのTypeORM関連のインポート（後述）
import { initializeDataSource } from "../../../../src/data-source";




export async function POST(req: Request) {
  try {
    await initializeDataSource();
  } catch (dbError) {
    console.error("Database initialization failed:", dbError);
    return NextResponse.json(
      { error: "Server configuration error (DB init)." },
      { status: 500 }
    );
  }

  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Email, password, and name are required" },
      { status: 400 }
    );
  }

  try {
    const cognitoService = ServiceFactory.createCognitoService();
    const userService = ServiceFactory.createUserService();
    await cognitoService.signUp(email, password, name);

    const createdUser = await userService.createUser(email, name);

    return NextResponse.json(
      {
        message:
          "Sign up successful. Confirmation code sent. DB record created.",
        userId: createdUser.id,
        nextStep: "CONFIRMATION_REQUIRED",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cognito Sign Up Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Sign up failed" },
      { status: 400 }
    );
  }
}

