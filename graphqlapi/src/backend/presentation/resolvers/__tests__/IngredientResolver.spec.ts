import "reflect-metadata";
import { IngredientResolver } from "@/backend/presentation/resolvers/IngredientResolver";
import { CreateIngredientInput } from "@/backend/infrastructure/graphql/inputs/CreateIngredientInput";
import { Ingredient } from "@/backend/infrastructure/graphql/types/Ingredient";

describe("IngredientResolver", () => {
  let resolver: IngredientResolver;

  beforeEach(() => {
    resolver = new IngredientResolver();
  });

  describe("createIngredient mutation", () => {
    it("should return a mock ingredient when called with valid input", async () => {
      const input: CreateIngredientInput = {
        name: "Test Ingredient",
      };

      const result = await resolver.createIngredient(input);

      expect(result).toEqual({
        id: "mock-ingredient-id",
        name: "Test Ingredient",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
