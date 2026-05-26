
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { AuthResolver } from "@/backend/presentation/resolvers/AuthResolver";
import { DishResolver } from "@/backend/presentation/resolvers/DishResolver";
import { IngredientNutrientResolver } from "@/backend/presentation/resolvers/IngredientNutrientResolver";
import { IngredientResolver } from "@/backend/presentation/resolvers/IngredientResolver";
import { MealResolver } from "@/backend/presentation/resolvers/MealResolver";
import { MeResolver } from "@/backend/presentation/resolvers/MeResolver";
import { NutrientResolver } from "@/backend/presentation/resolvers/NutrientResolver";
import { NutrientsIntakeStandardResolver } from "@/backend/presentation/resolvers/NutrientsIntakeStandardResolver";
import { UserResolver } from "@/backend/presentation/resolvers/UserResolver";

describe("GraphQL Schema Validation", () => {
  it("should build the schema without any errors", async () => {
    try {
      await buildSchema({
        resolvers: [
          AuthResolver,
          DishResolver,
          IngredientNutrientResolver,
          IngredientResolver,
          MealResolver,
          MeResolver,
          NutrientResolver,
          NutrientsIntakeStandardResolver,
          UserResolver,
        ],
      });
    } catch (error) {
      throw error;
    }
  });
});
