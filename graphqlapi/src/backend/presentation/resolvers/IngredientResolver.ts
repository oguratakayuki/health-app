import { Resolver, Mutation, Arg } from "type-graphql";
import { Ingredient } from "@/backend/infrastructure/graphql/types/Ingredient";
import { CreateIngredientInput } from "@/backend/infrastructure/graphql/inputs/CreateIngredientInput";

@Resolver()
export class IngredientResolver {
  @Mutation(() => Ingredient, { name: "createIngredient" })
  async createIngredient(
    @Arg("input", () => CreateIngredientInput) input: CreateIngredientInput,
  ): Promise<Ingredient> {
    return {
      id: "mock-ingredient-id",
      name: input.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
