import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { buildSchema } from "type-graphql";
import { resolvers } from "../../src/resolvers";
import { NextApiRequest, NextApiResponse } from "next";
import { initializeDataSource } from "../../src/data-source";
import { createContext } from "../../src/context";

// グローバルスコープでサーバーをキャッシュ
interface GlobalWithApollo {
  apolloServer?: ApolloServer;
  apolloHandler?: any;
  isDataSourceInitialized?: boolean;
}

const globalWithApollo = global as GlobalWithApollo;

async function initializeDatabase() {
  if (!globalWithApollo.isDataSourceInitialized) {
    await initializeDataSource();
    globalWithApollo.isDataSourceInitialized = true;
  }
}

async function createApolloServer() {
  // データベース接続を確実に初期化
  await initializeDatabase();

  const schema = await buildSchema({
    resolvers,
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    introspection: true,
  });

  // await server.start();
  return server;
}

// ハンドラーの初期化
async function getApolloHandler() {
  if (!globalWithApollo.apolloHandler) {
    const server = await createApolloServer();
    globalWithApollo.apolloServer = server;
    globalWithApollo.apolloHandler = startServerAndCreateNextHandler(server, {
      context: async (req: NextApiRequest, res: NextApiResponse) => {
        // createContextを使用
        return await createContext({ req, res });
      },
    });
  }

  return globalWithApollo.apolloHandler;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const apolloHandler = await getApolloHandler();
    return apolloHandler(req, res);
  } catch (error) {
    console.error("Apollo Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
