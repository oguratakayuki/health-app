import { Resolver, Query } from "type-graphql";
import { IngredientNutrient } from "../entities/IngredientNutrient";
import { AppDataSource } from "../data-source";

@Resolver()
export class IngredientNutrientResolver {
  @Query(() => [IngredientNutrient])
  async ingredientNutrients() {
    const repo = AppDataSource.getRepository(IngredientNutrient);
    return repo.find();
  }
}

