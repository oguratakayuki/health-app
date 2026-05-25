import { MealService } from "../MealService";
import { PrismaClient } from "@prisma/client";
import { IMealRepository } from "@backend/domain/interfaces/IMealRepository";
import { IDishRepository } from "@backend/domain/interfaces/IDishRepository";
import { IMealDishRepository } from "@backend/domain/interfaces/IMealDishRepository";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("MealService", () => {
  let mealService: MealService;
  let mockPrisma: any;
  let mockMealRepo: IMealRepository;
  let mockDishRepo: IDishRepository;
  let mockMealDishRepo: IMealDishRepository;

  beforeEach(() => {
    mockPrisma = {
      $transaction: vi.fn((callback) => callback(mockPrisma)),
    };
    mockMealRepo = {
      findById: vi.fn(),
      createWithTx: vi.fn(),
      getDailyNutrientSummary: vi.fn(),
      findByUserAndDate: vi.fn(),
      findByUserAndPeriod: vi.fn(),
    };
    mockDishRepo = {
      findById: vi.fn(),
      create: vi.fn(),
      createWithTx: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findByName: vi.fn(),
      count: vi.fn(),
      findWithIngredients: vi.fn(),
      findAllWithIngredients: vi.fn(),
    };
    mockMealDishRepo = {
      createManyWithTx: vi.fn(),
    };

    mealService = new MealService(
      mockPrisma,
      mockMealRepo,
      mockDishRepo,
      mockMealDishRepo,
    );
  });

  it("should create a meal with existing and new dishes", async () => {
    const input = {
      userId: 1,
      mealDate: new Date(),
      category: "lunch",
      dishes: [
        { id: 1 }, // Existing
        { name: "New Dish" }, // New
      ],
    };

    const mockMeal = { id: 100, userId: 1, mealDate: input.mealDate, category: "lunch" };
    const mockExistingDish = { id: 1, name: "Existing Dish" };
    const mockNewDish = { id: 2, name: "New Dish" };

    (mockMealRepo.createWithTx as any).mockResolvedValue(mockMeal);
    (mockDishRepo.findById as any).mockResolvedValue(mockExistingDish);
    (mockDishRepo.createWithTx as any).mockResolvedValue(mockNewDish);
    (mockMealDishRepo.createManyWithTx as any).mockResolvedValue(undefined);

    const result = await mealService.createMealWithDishes(input);

    expect(result).toEqual(mockMeal);
    expect(mockMealRepo.createWithTx).toHaveBeenCalledWith(mockPrisma, {
      userId: input.userId,
      mealDate: input.mealDate,
      category: input.category,
    });
    expect(mockDishRepo.findById).toHaveBeenCalledWith("1");
    expect(mockDishRepo.createWithTx).toHaveBeenCalledWith(mockPrisma, {
      name: "New Dish",
    });
    expect(mockMealDishRepo.createManyWithTx).toHaveBeenCalledWith(mockPrisma, 100, [1, 2]);
  });

  it("should throw error if existing dish is not found", async () => {
    const input = {
      userId: 1,
      mealDate: new Date(),
      category: "lunch",
      dishes: [{ id: 999 }],
    };

    (mockMealRepo.createWithTx as any).mockResolvedValue({ id: 100 });
    (mockDishRepo.findById as any).mockResolvedValue(null);

    await expect(mealService.createMealWithDishes(input)).rejects.toThrow("Dish 999 not found");
  });

  it("should get meal with dishes", async () => {
    const mockMeal = { id: 100, userId: 1 };
    (mockMealRepo.findById as any).mockResolvedValue(mockMeal);

    const result = await mealService.getMealWithDishes(100);
    expect(result).toEqual(mockMeal);
  });
});
