import "reflect-metadata";
import { IngredientResolver } from "@/backend/presentation/resolvers/IngredientResolver";
import type { GraphQLContext } from "@/backend/application/types/context";
import { CreateIngredientInput } from "@/backend/infrastructure/graphql/inputs/CreateIngredientInput";
import { Ingredient } from "@/backend/infrastructure/graphql/types/Ingredient";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("IngredientResolver", () => {
  let resolver: IngredientResolver;
  const mockIngredientService = {
    createIngredient: vi.fn(),
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
    it("should call ingredientService.createIngredient and return mapped result", async () => {
      const input: CreateIngredientInput = {
        name: "Test Ingredient",
        remarks: "Test Remarks",
        originalName: "Original Test Name",
      };

      const mockEntity = {
        id: "new-id",
        name: "Test Ingredient",
        remarks: "Test Remarks",
        originalName: "Original Test Name",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockIngredientService.createIngredient.mockResolvedValue(mockEntity);

      const result = await resolver.createIngredient(input, mockContext);

      expect(mockIngredientService.createIngredient).toHaveBeenCalledWith({
        name: "Test Ingredient",
        remarks: "Test Remarks",
        originalName: "Original Test Name",
      });
      expect(result).toEqual(mockEntity);
    });

    it("should throw error when ingredientService.createIngredient fails", async () => {
      const input: CreateIngredientInput = {
        name: "Error Ingredient",
      };
      mockIngredientService.createIngredient.mockRejectedValue(new Error("Service Error"));

      await expect(resolver.createIngredient(input, mockContext)).rejects.toThrow(
        "Failed to create ingredient: Service Error",
      );
    });
  });
});
