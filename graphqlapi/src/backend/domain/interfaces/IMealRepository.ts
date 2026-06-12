import { DailyNutrientSummary } from "@/backend/domain/entities/NutrientSummary";
import { Meal, MealWithDishes } from "@/backend/domain/entities/Meal";
import { Prisma } from "@prisma/client";
import { CreateMealDto, UpdateMealDto } from "@/backend/application/dtos/Meal";

export interface IMealRepository {
  findById(id: number): Promise<MealWithDishes | null>;
  createWithTx(
    tx: Prisma.TransactionClient,
    input: Omit<CreateMealDto, "dishes">,
  ): Promise<Meal>;
  update(
    id: number,
    data: UpdateMealDto,
    tx?: Prisma.TransactionClient,
  ): Promise<Meal>;
  delete(id: number): Promise<boolean>;
  getDailyNutrientSummary(
    userId: number,
    date: Date,
  ): Promise<DailyNutrientSummary[]>;
  findByUserAndDate(userId: string, date: Date): Promise<MealWithDishes[]>;
  findByUserAndPeriod(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<MealWithDishes[]>;
  findConnectedDishIds(
    tx: Prisma.TransactionClient,
    mealId: number,
  ): Promise<number[]>;
  connectDishes(
    tx: Prisma.TransactionClient,
    mealId: number,
    dishIds: number[],
  ): Promise<void>;
  disconnectDishes(
    tx: Prisma.TransactionClient,
    mealId: number,
    dishIds: number[],
  ): Promise<void>;
  findByUserAndPeriod(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<MealWithDishes[]>;
}
