import "reflect-metadata";
import { IngredientResolver } from "@/backend/presentation/resolvers/IngredientResolver";
import type { GraphQLContext } from "@/backend/application/types/context";
import { CreateIngredientInput } from "@/backend/infrastructure/graphql/inputs/CreateIngredientInput";
import { Ingredient } from "@/backend/infrastructure/graphql/types/Ingredient";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("IngredientResolver", () => {
  let resolver: IngredientResolver;
  const mockIngredientService = {
    getAllIngredients: vi.fn(),
  } as any;

  const mockContext: GraphQLContext = {
    ingredientService: mockIngredientService,
    user: { id: "test-user-id" } as any,
  };

  beforeEach(() => {
    resolver = new IngredientResolver();
    vi.clearAllMocks();
  });

  describe("createIngredient mutation", () => {
    it("should return a mock ingredient when creating", async () => {
      const input: CreateIngredientInput = {
        name: "Test Ingredient",
        remarks: "Test Remarks",
        originalName: "Original Test Name",
      };

      const result = await resolver.createIngredient(input, mockContext);

      expect(result).toEqual({
        id: "mock-id",
        name: input.name,
        remarks: input.remarks,
        originalName: input.originalName,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("should use default name when input name is missing", async () => {
      const input: CreateIngredientInput = {
        name: undefined,
      };

      const result = await resolver.createIngredient(input, mockContext);

      expect(result.name).toBe("Mock Ingredient");
    });
  });
});
