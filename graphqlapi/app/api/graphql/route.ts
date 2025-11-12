import "reflect-metadata";
import { NextRequest } from "next/server";
import { createYoga } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { resolvers } from "@/src/resolvers";
import { initializeDataSource } from "@/src/data-source";
import { verifyIdToken } from "@/src/services/tokenVerifier";

let yogaInstance: any = null;

async function getYoga() {
  if (!yogaInstance) {
    await initializeDataSource();

    // TypeGraphQLでGraphQLSchemaを構築
    const schema = await buildSchema({
      resolvers,
      validate: false,
    });

    yogaInstance = createYoga({
      schema, // ✅ ここを修正！createSchema(schema)ではなくschemaそのものを渡す
      graphqlEndpoint: "/api/graphql",
      context: async ({ request }) => {
        const user = await verifyIdToken(request);
        return { user };
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
