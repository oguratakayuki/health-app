// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { userService } from '../../../../src/services/userService'; // DB操作用
import { initializeDataSource } from '../../../../src/data-source'; // TypeORM初期化用

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: "Missing username or password" }, { status: 400 });
    }

    // DB初期化
    try {
      await initializeDataSource();
    } catch (dbError) {
      console.error("Database initialization failed:", dbError);
      return NextResponse.json(
        { message: "Server configuration error (DB init)." },
        { status: 500 }
      );
    }

    // Cognito Local に認証リクエスト
    const response = await fetch("http://cognito-local:9229/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
      body: JSON.stringify({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: "24yg3mrk2en4gaori4kw0btob",
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.AuthenticationResult) {
      console.error("Login failed ❌:", data);
      const message = data.message || "Login failed";
      return NextResponse.json({ message: message, details: data }, { status: 401 });
    }

    const { IdToken, AccessToken, RefreshToken } = data.AuthenticationResult;

    try {
      const decodedToken: any = jwtDecode(IdToken);
      const cognitoSub = decodedToken.sub;
      const email = decodedToken.email;

      await userService.updateCognitoSub(email, cognitoSub);
      console.log(`User ${email} linked with sub: ${cognitoSub}`);
    } catch (tokenError) {
      console.error("Token decoding or DB linking failed:", tokenError);
    }

    return NextResponse.json(
      {
        idToken: IdToken,
        accessToken: AccessToken,
        refreshToken: RefreshToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

