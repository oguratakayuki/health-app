// src/backend/infrastructure/repositories/prisma/MealRepository.ts
import { PrismaClient } from "@prisma/client";
import { IMealRepository } from "@backend/domain/interfaces/IMealRepository";
import { DailyNutrientSummary } from "@backend/domain/entities/NutrientSummary";
import { Meal } from "@backend/domain/entities/Meal";

export class MealRepository implements IMealRepository {
  constructor(private prisma: PrismaClient) {}

  async getDailyNutrientSummary(
    userId: number,
    date: Date,
  ): Promise<DailyNutrientSummary[]> {
    const dateString = date.toISOString().split("T")[0];

    const result = await this.prisma.$queryRaw<
      Array<{
        nutrient_name: string;
        nutrient_id: number;
        total_actual: number;
        unit: string;
      }>
    >`
      SELECT 
        n.id AS nutrient_id,
        n.name AS nutrient_name,
        SUM(inut.content_quantity * di.content_quantity / inut.content_unit_per) AS total_actual,
        inut.content_unit AS unit
      FROM 
        meals m
      JOIN 
        meal_dishes md ON m.id = md.meal_id
      JOIN 
        dishes d ON md.dish_id = d.id
      JOIN 
        dish_ingredients di ON d.id = di.dish_id
      JOIN 
        ingredients i ON di.ingredient_id = i.id
      JOIN 
        ingredient_nutrients inut ON i.id = inut.ingredient_id
      JOIN 
        nutrients n ON inut.nutrient_id = n.id
      WHERE 
        m.user_id = ${userId}
        AND DATE(m.meal_date) = DATE(${dateString})
      GROUP BY 
        n.id, inut.content_unit
      ORDER BY 
        n.id;
    `;

    // DailyNutrientSummary型に変換
    return result.map((item) => ({
      nutrientName: item.nutrient_name,
      totalAmount: item.total_actual,
      unit: item.unit,
      // 元のクエリには含まれていないフィールド
      nutrientId: item.nutrient_id,
      rdiPercentage: undefined,
      createdAt: new Date(),
    }));
  }
  async findByUserAndDate(userId: string, date: Date): Promise<Meal[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const meals = await this.prisma.meal.findMany({
      where: {
        userId: BigInt(userId),
        startTime: {
          gte: start,
          lte: end,
        },
      },
      include: {
        mealDishes: {
          include: {
            dish: {
              include: {
                dishIngredients: true,
              },
            },
          },
        },
      },
    });
    return meals.map((m) => ({
      id: Number(m.id),
      mealDate: m.mealDate,
      category: m.category,
      startTime: m.startTime,
      endTime: m.endTime,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      userId: Number(m.userId),
      mealDishes: m.mealDishes.map((md) => ({
        id: Number(md.id),
        mealId: Number(md.mealId),
        dishId: Number(md.dishId),
        createdAt: md.createdAt,
        updatedAt: md.updatedAt,
        dish: {
          id: Number(md.dish.id),
          name: md.dish.name,
          createdAt: md.dish.createdAt,
          updatedAt: md.dish.updatedAt,
          dishIngredients: md.dish.dishIngredients.map((di) => ({
            id: Number(di.id),
            dishId: Number(di.dishId),
            ingredientId: Number(di.ingredientId),
            contentQuantity: di.contentQuantity,
            contentUnit: di.contentUnit,
            createdAt: di.createdAt,
            updatedAt: di.updatedAt,
          })),
        },
      })),
    }));
  }
}
