import { Query, Resolver, Arg, Int } from "type-graphql";
import { IngredientNutrient } from "../entities/IngredientNutrient";
import { AppDataSource } from "../data-source";

@Resolver()
export class IngredientNutrientResolver {
  @Query(() => [IngredientNutrient])
  async ingredientNutrients(
    @Arg("limit", () => Int, { nullable: true }) limit?: number
  ) {
    const queryBuilder = AppDataSource.getRepository(IngredientNutrient)
      .createQueryBuilder("ingredientNutrient")
      .leftJoinAndSelect("ingredientNutrient.ingredient", "ingredient")
      .leftJoinAndSelect("ingredientNutrient.nutrient", "nutrient")
      .orderBy("ingredientNutrient.id", "ASC");

    if (limit) {
      queryBuilder.take(limit);
    }

    return queryBuilder.getMany();
  }
}
