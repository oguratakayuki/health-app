import { NextResponse } from "next/server";
import { ServiceFactory } from "@/backend/application/services/adapters";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and confirmation code are required" },
        { status: 400 },
      );
    }
    const cognitoService = ServiceFactory.createCognitoService();

    // Cognito で確認コードを検証
    await cognitoService.confirmSignUp(email, code);

    return NextResponse.json(
      { message: "Account confirmed successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Cognito Confirm SignUp Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Confirmation failed" },
      { status: 400 },
    );
  }
}
