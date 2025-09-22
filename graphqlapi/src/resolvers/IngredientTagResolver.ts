import { Resolver, Query } from "type-graphql";
import { IngredientTag } from "../entities/IngredientTag";
import { AppDataSource } from "../data-source";

@Resolver()
export class IngredientTagResolver {
  @Query(() => [IngredientTag])
  async ingredientTags() {
    return AppDataSource.getRepository(IngredientTag).find({
      relations: ["ingredient", "tag"],
    });
  }
}

