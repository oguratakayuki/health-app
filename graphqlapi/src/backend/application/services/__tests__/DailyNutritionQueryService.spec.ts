import { DailyNutritionQueryService } from "../DailyNutritionQueryService";
import { MealRepository } from "@/backend/infrastructure/repositories/prisma/MealRepository";
import { IngredientNutrientRepository } from "@/backend/infrastructure/repositories/prisma/IngredientNutrientRepository";
import { runInTransaction } from "@/backend/infrastructure/repositories/prisma/__tests__/test-transaction";

describe("DailyNutritionQueryService", () => {
  describe("#fetchAggregationItemsByPeriod", () => {
    it("should return aggregation items within the specified period", async () => {
      await runInTransaction(async (tx) => {
        const mealRepository = new MealRepository(tx);

        const ingredientNutrientRepository = new IngredientNutrientRepository(
          tx,
        );

        const service = new DailyNutritionQueryService(
          mealRepository,
          ingredientNutrientRepository,
        );

        const userId = "1";

        const from = new Date("2026-01-01");
        const to = new Date("2026-01-31");

        const user = await tx.user.create({
          data: {
            id: BigInt(1),
            name: "test-user",
            email: "test@example.com",
            cognitoSub: "aaa",
            createdAt: from,
            updatedAt: from,
          },
        });

        // =========================
        // nutrient
        // =========================
        const nutrient = await tx.nutrient.create({
          data: {
            name: "Protein",
            code: "protein_g",
            createdAt: from,
            updatedAt: from,
          },
        });

        // =========================
        // ingredient
        // =========================
        const ingredient = await tx.ingredient.create({
          data: {
            name: "Chicken",
            remarks: "...",
            createdAt: from,
            updatedAt: from,
          },
        });

        // =========================
        // ingredient_nutrient
        // =========================
        await tx.ingredientNutrient.create({
          data: {
            ingredientId: ingredient.id,
            nutrientId: nutrient.id,
            contentQuantity: 20,
            contentUnit: "g",
            contentUnitPer: 100,
            createdAt: from,
            updatedAt: from,
          },
        });

        // =========================
        // dish
        // =========================
        const dish = await tx.dish.create({
          data: {
            name: "Chicken Dish",
            createdAt: from,
            updatedAt: from,
          },
        });

        // =========================
        // dish ingredient
        // =========================
        await tx.dishIngredient.create({
          data: {
            dishId: dish.id,
            ingredientId: ingredient.id,
            contentQuantity: 150,
            contentUnit: "g",
            createdAt: from,
            updatedAt: from,
          },
        });

        // =========================
        // meal in range
        // =========================
        const meal1 = await tx.meal.create({
          data: {
            userId: user.id,
            mealDate: new Date("2026-01-10"),
            category: "lunch",
            createdAt: from,
            updatedAt: from,
          },
        });

        const meal2 = await tx.meal.create({
          data: {
            userId: user.id,
            mealDate: new Date("2026-01-20"),
            category: "dinner",
            createdAt: from,
            updatedAt: from,
          },
        });

        // =========================
        // meal_dishes
        // =========================
        await tx.mealDish.create({
          data: {
            mealId: meal1.id,
            dishId: dish.id,
            createdAt: from,
            updatedAt: from,
          },
        });

        await tx.mealDish.create({
          data: {
            mealId: meal2.id,
            dishId: dish.id,
            createdAt: from,
            updatedAt: from,
          },
        });

        // =========================
        // out of range meal
        // =========================
        const outsideMeal = await tx.meal.create({
          data: {
            userId: user.id,
            mealDate: new Date("2026-02-10"),
            category: "lunch",
            createdAt: from,
            updatedAt: from,
          },
        });

        await tx.mealDish.create({
          data: {
            mealId: outsideMeal.id,
            dishId: dish.id,
            createdAt: from,
            updatedAt: from,
          },
        });

        const result = await service.fetchAggregationItemsByPeriod(
          userId,
          from,
          to,
        );

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        console.log(result);

        for (const item of result) {
          expect(item.eatenAt >= from).toBe(true);
          expect(item.eatenAt <= to).toBe(true);

          expect(item.nutrientCode).toBeDefined();
          expect(typeof item.ingredientAmountGram).toBe("number");
          expect(typeof item.nutrientPer100g).toBe("number");
        }
      });
    });
  });
});
