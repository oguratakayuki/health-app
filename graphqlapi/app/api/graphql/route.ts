import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { buildSchema } from "type-graphql";
import { resolvers } from "../../../src/resolvers";
import { initializeDataSource } from "../../../src/data-source";
import { createContext } from "../../../src/context";
import { NextRequest, NextResponse } from "next/server";

// グローバルキャッシュ防止: サーバー再起動時の再初期化を避ける
const globalForApollo = globalThis as unknown as {
  apolloHandler?: ReturnType<typeof startServerAndCreateNextHandler>;
  isDBInitialized?: boolean;
};

// DB 初期化関数
async function initializeDatabase() {
  if (!globalForApollo.isDBInitialized) {
    await initializeDataSource();
    globalForApollo.isDBInitialized = true;
  }
}

// Apollo Server 初期化関数
async function getApolloHandler() {
  if (!globalForApollo.apolloHandler) {
    await initializeDatabase();

    const schema = await buildSchema({
      resolvers,
      validate: false,
    });

    const server = new ApolloServer({
      schema,
      introspection: true, // 開発中は introspection を有効に
    });

    const handler = startServerAndCreateNextHandler(server, {
      context: async (req: NextRequest) => {
        // createContext でリクエストコンテキスト生成
        // (App Router では NextResponse をここで直接扱わない)
        return await createContext({
          req: req as any, // createContext の型に合わせてキャスト
          res: undefined,
        });
      },
    });

    globalForApollo.apolloHandler = handler;
  }

  return globalForApollo.apolloHandler;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const apolloHandler = await getApolloHandler();

    // CORSヘッダーを常に付与
    const res = await apolloHandler(req);

    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return res;
  } catch (error) {
    console.error("Apollo Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
