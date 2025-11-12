
import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { buildSchema } from "type-graphql";
import { resolvers } from "@/src/resolvers";
import { initializeDataSource } from "@/src/data-source";
import { verifyIdToken } from "@/src/services/tokenVerifier";

let apolloHandler: any = null;
let isInitialized = false;

async function initializeServer() {
  if (!isInitialized) {
    await initializeDataSource();
    const schema = await buildSchema({ resolvers, validate: false });

    const server = new ApolloServer({ schema, introspection: true });

    // ✅ context内でidTokenを検証
    apolloHandler = startServerAndCreateNextHandler(server, {
      context: async (req: Request) => {
        const user = await verifyIdToken(req);
        return { user };
      },
    });

    isInitialized = true;
  }
  return apolloHandler;
}

export async function POST(req: Request) {
  try {
    const handler = await initializeServer();
    return handler(req);
  } catch (error) {
    console.error("Apollo Server Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
