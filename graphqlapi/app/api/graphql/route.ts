// app/api/graphql/route.ts
import "reflect-metadata";
import { NextRequest } from "next/server";
import { createYoga } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { resolvers } from "@/backend/presentation/resolvers";
import { verifyIdToken } from "@/backend/application/services/tokenVerifier";
import { ServiceFactory } from "@/backend/application/services/adapters";
import { GraphQLContext } from "@/backend/application/types/context";
import { authChecker } from "@/backend/application/auth/authChecker";

let yogaInstance: any = null;

async function getYoga() {
  if (!yogaInstance) {
    console.log("🔧 Initializing GraphQL Yoga with context support...");
    // GraphQLスキーマの構築
    const schema = await buildSchema({
      resolvers,
      validate: false,
      authChecker,
      authMode: "null",
    });

    yogaInstance = createYoga({
      schema,
      graphqlEndpoint: "/api/graphql",
      context: async ({ request }): Promise<GraphQLContext> => {
        // ユーザー認証
        let user;
        try {
          user = await verifyIdToken(request);
        } catch (error) {
          console.warn("Authentication failed:", error.message);
          // 認証失敗でもコンテキストは作成（公開クエリ用）
          user = undefined;
        }
        // サービスインスタンスを作成
        const services = ServiceFactory.getServicesFromContext();
        // 完全なコンテキストを作成
        const context: GraphQLContext = {
          user: user || undefined, // nullをundefinedに変換
          ...services,
        };
        return context;
      },
      // 開発環境ではGraphiQLを有効化
      graphiql: process.env.NODE_ENV !== "production",
      // エラーハンドリング
      maskedErrors: process.env.NODE_ENV === "production",
      // リクエスト/レスポンスログ（開発環境のみ）
      logging: process.env.NODE_ENV !== "production" ? "debug" : undefined,
    });
    console.log("✅ GraphQL Yoga initialized with context support");
  }

  return yogaInstance;
}

export async function POST(request: NextRequest) {
  try {
    const yoga = await getYoga();
    const response = await yoga.handleRequest(request);
    return response;
  } catch (error: any) {
    console.error("GraphQL handler error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        ...(process.env.NODE_ENV !== "production" && {
          details: error.message,
        }),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}

// 開発環境でのホットリロード対応
if (process.env.NODE_ENV !== "production" && typeof global !== "undefined") {
  (global as any).__cleanupGraphQL = async () => {
    if (yogaInstance) {
      yogaInstance = null;
      console.log("🧹 GraphQL Yoga instance cleaned up");
    }
  };
}
