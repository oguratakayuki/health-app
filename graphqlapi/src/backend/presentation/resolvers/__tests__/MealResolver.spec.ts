
import "reflect-metadata";
import { MealResolver } from "@/backend/presentation/resolvers/MealResolver";
import type { GraphQLContext } from "@/backend/application/types/context";
import type { Meal } from "@/backend/infrastructure/graphql/types/Meal";
import type { MealWithDishes } from "@/backend/domain/entities/Meal";
import { CreateMealWithDishesInput } from "@/backend/infrastructure/graphql/inputs/prisma/CreateMealWithDishesInput";
import { UpdateMealInput } from "@/backend/infrastructure/graphql/inputs/prisma/UpdateMealInput";

describe("MealResolver", () => {
  let resolver: MealResolver;
  const mockMealService = {
    getMeal: jest.fn(),
    getAllMeals: jest.fn(),
    getMealWithDishes: jest.fn(),
    getAllMealsWithDishes: jest.fn(),
    getMealsCount: jest.fn(),
    createMealWithDishes: jest.fn(),
    updateMeal: jest.fn(),
    deleteMeal: jest.fn(),
  } as any;

  const mockContext: GraphQLContext = {
    mealService: mockMealService,
    user: { id: "test-user-id" } as any,
  };

  beforeEach(() => {
    resolver = new MealResolver();
    jest.clearAllMocks();
  });

  describe("meal query", () => {
    it("should call mealService.getMeal and return meal", async () => {
      const mealId = "test-meal-id";
      const mockMeal: Meal = {
        id: mealId,
        name: "Test Meal",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
      mockMealService.getMeal.mockResolvedValue(mockMeal);

      const result = await resolver.meal(mealId, mockContext);

      expect(mockMealService.getMeal).toHaveBeenCalledWith(mealId);
      expect(result).toEqual(mockMeal);
    });

    it("should throw error when mealService.getMeal fails", async () => {
      mockMealService.getMeal.mockRejectedValue(new Error("DB Error"));
      await expect(resolver.meal("id", mockContext)).rejects.toThrow("Failed to fetch meal");
    });
  });

  describe("meals query", () => {
    it("should call mealService.getAllMeals and return list of meals", async () => {
      const mockMeals: Meal[] = [
        { id: "1", name: "Meal 1" } as any,
        { id: "2", name: "Meal 2" } as any,
      ];
      mockMealService.getAllMeals.mockResolvedValue(mockMeals);

      const result = await resolver.meals(mockContext);

      expect(mockMealService.getAllMeals).toHaveBeenCalled();
      expect(result).toEqual(mockMeals);
    });
  });

  describe("mealWithDishes query", () => {
    it("should call mealService.getMealWithDishes with numeric id", async () => {
      const mealId = "123";
      const mockMealWithDishes: MealWithDishes = {
        id: 123,
        name: "Meal with Dishes",
        dishes: [],
      } as any;
      mockMealService.getMealWithDishes.mockResolvedValue(mockMealWithDishes);

      const result = await resolver.mealWithDishes(mealId, mockContext);

      expect(mockMealService.getMealWithDishes).toHaveBeenCalledWith(123);
      expect(result).toEqual(mockMealWithDishes);
    });
  });

  describe("mealsWithDishes query", () => {
    it("should call mealService.getAllMealsWithDishes with dates", async () => {
      const from = "2023-01-01";
      const to = "2023-01-07";
      const mockMeals: MealWithDishes[] = [{ id: 1, name: "Meal 1", dishes: [] } as any];
      mockMealService.getAllMealsWithDishes.mockResolvedValue(mockMeals);

      const result = await resolver.mealsWithDishes(mockContext, from, to);

      expect(mockMealService.getAllMealsWithDishes).toHaveBeenCalledWith(
        mockContext.user.id,
        new Date(from),
        new Date(to),
      );
      expect(result).toEqual(mockMeals);
    });
  });

  describe("mealsCount query", () => {
    it("should call mealService.getMealsCount and return string", async () => {
      mockMealService.getMealsCount.mockResolvedValue(10);
      const result = await resolver.mealsCount(mockContext);
      expect(result).toBe("10");
    });
  });

  describe("createMealWithDishes mutation", () => {
    it("should call mealService.createMealWithDishes", async () => {
      const input: CreateMealWithDishesInput = {
        name: "New Meal",
        dishes: [],
      } as any;
      const mockMeal: Meal = { id: "new-id", name: "New Meal" } as any;
      mockMealService.createMealWithDishes.mockResolvedValue(mockMeal);

      const result = await resolver.createMealWithDishes(input, mockContext);

      expect(mockMealService.createMealWithDishes).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockMeal);
    });
  });

  describe("updateMeal mutation", () => {
    it("should call mealService.updateMeal", async () => {
      const id = "meal-1";
      const input: UpdateMealInput = { name: "Updated Name" } as any;
      const mockMeal: Meal = { id, name: "Updated Name" } as any;
      mockMealService.updateMeal.mockResolvedValue(mockMeal);

      const result = await resolver.updateMeal(id, input, mockContext);

      expect(mockMealService.updateMeal).toHaveBeenCalledWith(id, input);
      expect(result).toEqual(mockMeal);
    });
  });

  describe("deleteMeal mutation", () => {
    it("should call mealService.deleteMeal and return boolean", async () => {
      const id = "meal-1";
      mockMealService.deleteMeal.mockResolvedValue(true);
      const result = await resolver.deleteMeal(id, mockContext);
      expect(result).toBe(true);
    });
  });

  describe("context validation", () => {
    it("should throw error if mealService is missing in context", async () => {
      const emptyContext = {} as any;
      await expect(resolver.meal("id", emptyContext)).rejects.toThrow("MealService is not available in context");
    });
  });
});
