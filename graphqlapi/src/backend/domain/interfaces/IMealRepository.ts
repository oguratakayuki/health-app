import { DailyNutrientSummary } from "@/backend/domain/entities/NutrientSummary";
import { Meal, CreateMealInput, MealDishWithDish } from "@/backend/domain/entities/Meal";
import { Prisma } from "@prisma/client";

export interface IMealRepository {
  findById(id: number): Promise<Meal | null>;
  createWithTx(tx: Prisma.TransactionClient, input: Omit<CreateMealInput, "dishes">): Promise<Meal>;
  getDailyNutrientSummary(
    userId: number,
    date: Date,
  ): Promise<DailyNutrientSummary[]>;
  findByUserAndDate(userId: string, date: Date): Promise<MealDishWithDish[]>;
  findByUserAndPeriod(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<MealDishWithDish[]>;
}
