
import "reflect-metadata";
import express, { Application } from "express";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { CategoriesResolver } from "./resolvers/CategoriesResolver";
import { IngredientNutrientsResolver } from "./resolvers/IngredientNutrientsResolver";
import { IngredientResolver } from './resolvers/IngredientResolver'
import { NutrientResolver } from "./resolvers/NutrientResolver";
import { IngredientTagResolver } from './resolvers/IngredientTagResolver'
import { TagResolver } from './resolvers/TagResolver'

async function bootstrap() {
  await AppDataSource.initialize();

  const schema = await buildSchema({
    resolvers: [
      CategoriesResolver,
      IngredientNutrientsResolver,
      IngredientResolver,
      NutrientResolver,
      IngredientTagResolver,
      TagResolver,
    ],
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
