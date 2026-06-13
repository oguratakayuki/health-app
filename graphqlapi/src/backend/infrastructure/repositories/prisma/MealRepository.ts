// src/backend/infrastructure/repositories/prisma/MealRepository.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { IMealRepository } from "@backend/domain/interfaces/IMealRepository";
import { DailyNutrientSummary } from "@backend/domain/entities/NutrientSummary";
import {
  Meal,
  MealWithDishes,
  CreateMealRepositoryInput,
  UpdateMealRepositoryInput,
} from "@backend/domain/entities/Meal";
import { MealRepositoryMapper } from "@/backend/acl/domain_infrastructure/MealRepositoryMapper";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// プラグインを有効化
dayjs.extend(utc);
dayjs.extend(timezone);

// デフォルトのタイムゾーンをアジア/東京（JST）に設定
dayjs.tz.setDefault("Asia/Tokyo");

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
    return meal ? MealRepositoryMapper.mapToMealWithDishes(meal) : null;
  }

  async createWithTx(
    tx: Prisma.TransactionClient,
    input: CreateMealRepositoryInput,
  ): Promise<Meal> {
    const startTimeWithDate = this.parseTimeToDate(input.startTime);
    const endTimeWithDate = this.parseTimeToDate(input.endTime);

    const meal = await tx.meal.create({
      data: {
        userId: BigInt(input.userId),
        mealDate: input.mealDate,
        category: input.category,
        startTime: startTimeWithDate,
        endTime: endTimeWithDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return MealRepositoryMapper.mapToMeal(meal as any);
  }

  async update(
    id: number,
    input: UpdateMealRepositoryInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Meal> {
    // tx があれば tx を、無ければ通常の this.prisma を使う
    const client = tx ?? this.prisma;

    const startTimeWithDate = this.parseTimeToDate(input.startTime);
    const endTimeWithDate = this.parseTimeToDate(input.endTime);
    const meal = await client.meal.update({
      where: { id },
      data: {
        mealDate: input.mealDate,
        category: input.category,
        startTime: startTimeWithDate,
        endTime: endTimeWithDate,
      },
    });
    return MealRepositoryMapper.mapToMeal(meal);
  }

  // 現在紐づいている料理IDの取得
  async findConnectedDishIds(
    tx: Prisma.TransactionClient,
    mealId: number,
  ): Promise<number[]> {
    // tx があれば tx を、無ければ通常の this.prisma を使う
    const client = tx ?? this.prisma;
    const dishes = await client.mealDish.findMany({
      where: { mealId },
      select: { dishId: true },
    });
    return dishes.map((d) => Number(d.dishId));
  }

  // 料理の複数紐づけ（追加）
  async connectDishes(
    tx: Prisma.TransactionClient,
    mealId: number,
    dishIds: number[],
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await client.mealDish.createMany({
      data: dishIds.map((dishId) => ({
        mealId,
        dishId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
  }
  async disconnectDishes(
    tx: Prisma.TransactionClient,
    mealId: number,
    dishIds: number[],
  ): Promise<void> {
    const client = tx ?? this.prisma;
    await client.mealDish.deleteMany({
      where: {
        mealId,
        dishId: { in: dishIds },
      },
    });
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
  ): Promise<MealWithDishes[]> {
    // 1. 引数のDate（JST想定）から、その日の始まりと翌日の始まり（UTC）を生成
    const startOfDay = dayjs.tz(date).startOf("day").toDate();
    const startOfNextDay = dayjs.tz(date).startOf("day").add(1, "day").toDate();
    const meals = await this.prisma.meal.findMany({
      where: {
        userId: BigInt(userId),
        mealDate: {
          gte: startOfDay, // JST 00:00:00 相当のUTC
          lt: startOfNextDay, // JST 翌00:00:00 相当のUTC
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
    return meals.map((m) => MealRepositoryMapper.mapToMealWithDishes(m as any));
  }

  async findByUserAndPeriod(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<MealWithDishes[]> {
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

    return meals.map((m) => MealRepositoryMapper.mapToMealWithDishes(m as any));
  }
  /**
   * "12:11" のような時刻文字列から Prisma の TIME 型保存用の Date オブジェクトを生成する
   */
  private parseTimeToDate(timeString: string): Date {
    // "12:11" を ":" で分割して数値にする
    const parts = timeString.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    // 簡易バリデーション (パース失敗や不正な時間の場合はエラーを投げる)
    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new Error(
        `Invalid time format. Expected "HH:mm", got "${timeString}"`,
      );
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // 秒、ミリ秒は0に固定

    return date;
  }
}
