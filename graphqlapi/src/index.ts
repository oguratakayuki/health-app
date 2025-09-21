
import "reflect-metadata";
import express, { Application } from "express";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { NutrientResolver } from "./resolvers/NutrientResolver";

async function bootstrap() {
  await AppDataSource.initialize();

  const schema = await buildSchema({
    resolvers: [NutrientResolver],
    validate: false,
  });

  const server = new ApolloServer({ schema });
  await server.start();

  const app: Application = express();
  server.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log("🚀 GraphQL server ready at http://localhost:4000/graphql")
  );
}

bootstrap();
