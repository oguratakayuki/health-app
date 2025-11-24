// app/api/graphql/route.ts
import "reflect-metadata";
import { NextRequest } from "next/server";
import { createYoga } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { resolvers } from "@/src/resolvers";
import { initializeDataSource } from "@/src/data-source";
import { verifyIdToken } from "@/src/services/tokenVerifier";

import { prisma } from "../../../lib/prisma";
import { testPrismaConnection } from "../../../lib/test-connection";

let yogaInstance: any = null;

async function getYoga() {
  if (!yogaInstance) {
    // TypeORMデータソースの初期化
    const dataSource = await initializeDataSource();

    // Prisma接続のテスト
    console.log('🔧 Testing Prisma connection...');
    const prismaConnected = await testPrismaConnection();
    if (!prismaConnected) {
      throw new Error('Prisma connection failed');
    }

    // GraphQLスキーマの構築
    const schema = await buildSchema({
      resolvers,
      validate: false,
    });

    yogaInstance = createYoga({
      schema,
      graphqlEndpoint: "/api/graphql",
      context: async ({ request }) => {
        const user = await verifyIdToken(request);
        return { 
          user,
          prisma // Prismaクライアントをコンテキストに追加
        };
      },
    });
  }

  return yogaInstance;
}

export async function POST(request: NextRequest) {
  const yoga = await getYoga();
  return yoga.handleRequest(request);
}

export async function GET(request: NextRequest) {
  const yoga = await getYoga();
  return yoga.handleRequest(request);
}

