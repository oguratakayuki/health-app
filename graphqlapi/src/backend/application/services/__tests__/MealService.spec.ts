
import { MealService } from "../MealService";
import { PrismaClient } from "@prisma/client";
import { IMealRepository } from "@backend/domain/interfaces/IMealRepository";
import { IDishRepository } from "@backend/domain/interfaces/IDishRepository";
import { IMealDishRepository } from "@backend/domain/interfaces/IMealDishRepository";
import { UpdateMealInput } from "@backend/infrastructure/graphql/inputs/prisma/UpdateMealInput";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { Meal } from "@backend/domain/entities/Meal";

describe("MealService", () => {
  let mealService: MealService;
  let mockPrisma: any;
  let mockMealRepo: IMealRepository;
  let mockDishRepo: IDishRepository;
  let mockMealDishRepo: IMealDishRepository;

  beforeEach(() => {
    mockPrisma = {
      $transaction: vi.fn((callback) => callback(mockPrisma)),
      meal: {
        update: vi.fn(),
      },
      mealDish: {
        createMany: vi.fn(),
        deleteMany: vi.fn(),
        findMany: vi.fn(),
      },
    };
    mockMealRepo = {
      findById: vi.fn(),
      createWithTx: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
        { id: 1 },
        { name: "New Dish" },
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

  describe("updateMeal", () => {
    it("should update meal basic info and add dishes only if they don't exist", async () => {
      const mealId = "123";
      const input: UpdateMealInput = {
        mealDate: new Date(),
        category: "dinner",
        addDishIds: [10, 20],
      };
      const mockMeal = { id: 123, name: "Updated Meal" } as Meal;

      // Mock current dishes: dish 10 already exists
      mockPrisma.mealDish.findMany = vi.fn().mockResolvedValue([
        { dishId: 10 },
      ]);
      
      mockPrisma.meal.update = vi.fn().mockResolvedValue(mockMeal);
      mockPrisma.mealDish.createMany = vi.fn().mockResolvedValue({ count: 1 });
      
      mockMealRepo.findById = vi.fn().mockResolvedValue(mockMeal);

      const result = await mealService.updateMeal(mealId, input);

      expect(result).toEqual(mockMeal);
      expect(mockPrisma.meal.update).toHaveBeenCalled();
      expect(mockPrisma.mealDish.createMany).toHaveBeenCalledWith({
        data: [{
          mealId: 123,
          dishId: 20,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }],
      });
    });

    it("should remove dishes when removeDishIds is provided", async () => {
      const mealId = "123";
      const input: UpdateMealInput = {
        removeDishIds: [5, 6],
      };
      const mockMeal = { id: 123, name: "Meal" } as Meal;

      mockPrisma.meal.update = vi.fn().mockResolvedValue(mockMeal);
      mockPrisma.mealDish.findMany = vi.fn().mockResolvedValue([]);
      mockPrisma.mealDish.deleteMany = vi.fn().mockResolvedValue({ count: 2 });
      mockMealRepo.findById = vi.fn().mockResolvedValue(mockMeal);

      const result = await mealService.updateMeal(mealId, input);

      expect(result).toEqual(mockMeal);
      expect(mockPrisma.mealDish.deleteMany).toHaveBeenCalledWith({
        where: {
          mealId: 123,
          dishId: { in: [5, 6] },
        },
      });
    });

    it("should throw error when update fails", async () => {
      const mealId = "123";
      const input: UpdateMealInput = { category: "snack" };
      mockPrisma.meal.update = vi.fn().mockRejectedValue(new Error("DB Error"));

      await expect(mealService.updateMeal(mealId, input)).rejects.toThrow("DB Error");
    });
  });

  describe("deleteMeal", () => {
    it("should return true when meal is successfully deleted", async () => {
      (mockMealRepo.delete as any).mockResolvedValue(true);
      const result = await mealService.deleteMeal("123");
      expect(result).toBe(true);
      expect(mockMealRepo.delete).toHaveBeenCalledWith(123);
    });

    it("should return false when meal cannot be deleted", async () => {
      (mockMealRepo.delete as any).mockResolvedValue(false);
      const result = await mealService.deleteMeal("123");
      expect(result).toBe(false);
      expect(mockMealRepo.delete).toHaveBeenCalledWith(123);
    });
  });
});
