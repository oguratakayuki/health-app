// src/backend/infrastructure/repositories/prisma/MealRepository.ts
import { PrismaClient } from "@prisma/client";
import { IMealRepository } from "@backend/domain/interfaces/IMealRepository";
import { DailyNutrientSummary } from "@backend/domain/entities/NutrientSummary";

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
}
