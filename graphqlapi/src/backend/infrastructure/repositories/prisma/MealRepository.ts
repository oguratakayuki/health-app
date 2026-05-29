// src/backend/infrastructure/repositories/prisma/MealRepository.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { IMealRepository } from "@backend/domain/interfaces/IMealRepository";
import { DailyNutrientSummary } from "@backend/domain/entities/NutrientSummary";
import {
  Meal,
  CreateMealInput,
  UpdateMealInput,
  MealDishWithDish,
  MealWithDishes,
} from "@backend/domain/entities/Meal";
import { MealMapper } from "./mappers/MealMapper";

export class MealRepository implements IMealRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<MealWithDishes | null> {
    const meal = await this.prisma.meal.findUnique({
      where: { id },
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
    return meal ? MealMapper.mapToMeal(meal as any) : null;
  }

  async createWithTx(
    tx: Prisma.TransactionClient,
    input: Omit<CreateMealInput, "dishes">,
  ): Promise<Meal> {
    const meal = await tx.meal.create({
      data: {
        userId: BigInt(input.userId),
        mealDate: input.mealDate,
        category: input.category,
      },
    });
    return MealMapper.mapToMeal(meal as any);
  }

  async update(id: number, input: UpdateMealInput): Promise<Meal> {
    let finalStartTime: Date | undefined;
    let finalEndTime: Date | undefined;

    if (input.startTime || input.endTime) {
      // a. 更新用の日付を決定 (入力値があれば優先、なければDBから取得)
      let baseDate: Date;
      if (input.mealDate) {
        baseDate = new Date(input.mealDate);
      } else {
        const currentMeal = await this.prisma.meal.findUnique({
          where: { id },
          select: { mealDate: true },
        });
        if (!currentMeal) throw new Error("Meal not found");
        baseDate = currentMeal.mealDate;
      }

      // b. 時刻文字列 (HH:mm) を Date オブジェクトに変換
      const combineDateAndTime = (timeStr?: string) => {
        if (!timeStr) return undefined;
        const [hours, minutes] = timeStr.split(":").map(Number);
        const date = new Date(baseDate);
        date.setUTCHours(hours, minutes, 0, 0);
        return date;
      };

      finalStartTime = combineDateAndTime(input.startTime);
      finalEndTime = combineDateAndTime(input.endTime);
    }

    return await this.prisma.meal
      .update({
        where: { id },
        data: {
          mealDate: input.mealDate ? new Date(input.mealDate) : undefined,
          category: input.category,
          startTime: finalStartTime,
          endTime: finalEndTime,
          userId: input.userId ? BigInt(input.userId) : undefined,
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
      })
      .then((meal) => MealMapper.mapToMeal(meal as any));
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.meal.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

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

    return result.map((item) => ({
      nutrientName: item.nutrient_name,
      totalAmount: item.total_actual,
      unit: item.unit,
      nutrientId: item.nutrient_id,
      rdiPercentage: undefined,
      createdAt: new Date(),
    }));
  }

  async findByUserAndDate(
    userId: string,
    date: Date,
  ): Promise<MealDishWithDish[]> {
    const meals = await this.prisma.meal.findMany({
      where: {
        userId: BigInt(userId),
        mealDate: date,
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
    return meals.map((m) => MealMapper.mapToMeal(m as any));
  }

  async findByUserAndPeriod(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<MealDishWithDish[]> {
    const meals = await this.prisma.meal.findMany({
      where: {
        userId: BigInt(userId),
        mealDate: {
          gte: from,
          lte: to,
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
      orderBy: {
        mealDate: "asc",
      },
    });

    return meals.map((m) => MealMapper.mapToMeal(m as any));
  }
}
