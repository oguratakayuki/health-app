// app/api/test/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let dbStatus: "ok" | "ng" = "ng";
  let dbError: string | null = null;

  try {
    // DB 接続確認
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "ok";
  } catch (e: any) {
    dbError = e?.message ?? String(e);
  }

  return NextResponse.json({
    env: {
      NODE_ENV: process.env.NODE_ENV,
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      DATABASE_URL: process.env.DATABASE_URL,

      // Next.js でクライアントにも露出する変数
      NEXT_PUBLIC_COGNITO_USER_POOL_ID:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      NEXT_PUBLIC_COGNITO_ENDPOINT: process.env.NEXT_PUBLIC_COGNITO_ENDPOINT,
    },
    database: {
      status: dbStatus,
      error: dbError,
    },
  });
}
