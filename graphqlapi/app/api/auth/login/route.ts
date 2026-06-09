// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ServiceFactory } from "@/backend/application/services/adapters";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Missing username or password" },
        { status: 400 },
      );
    }

    const cognitoService = ServiceFactory.createCognitoService();
    const { idToken, accessToken, refreshToken } = await cognitoService.signIn(
      username,
      password,
    );

    const res = NextResponse.json({ message: "ログイン成功" });
    const maxAge = 60 * 60 * 24 * 7; // 7日間
    const isProduction = process.env.NODE_ENV === "production";
    console.log(`process.env.NODE_ENV ${process.env.NODE_ENV}`);
    res.cookies.set("idToken", idToken!, {
      httpOnly: true,
      secure: isProduction,
      path: "/",
      sameSite: "lax",
      maxAge: maxAge,
    });
    res.cookies.set("accessToken", accessToken!, {
      httpOnly: true,
      secure: isProduction,
      path: "/",
      sameSite: "lax",
      maxAge: maxAge,
    });
    if (refreshToken) {
      res.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        path: "/",
        sameSite: "lax",
        maxAge: maxAge * 30,
      });
    }

    return res;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
