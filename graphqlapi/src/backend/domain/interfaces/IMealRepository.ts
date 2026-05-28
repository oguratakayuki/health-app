import { DailyNutrientSummary } from "@/backend/domain/entities/NutrientSummary";
import {
  Meal,
  CreateMealInput,
  MealDishWithDish,
  MealWithDishes,
} from "@/backend/domain/entities/Meal";
import { Prisma } from "@prisma/client";

export interface IMealRepository {
  findById(id: number): Promise<MealWithDishes | null>;
  createWithTx(
    tx: Prisma.TransactionClient,
    input: Omit<CreateMealInput, "dishes">,
  ): Promise<Meal>;
  update(id: number, input: UpdateMealInput): Promise<Meal>;
  delete(id: number): Promise<boolean>;
  getDailyNutrientSummary(
    userId: number,
    date: Date,
  ): Promise<DailyNutrientSummary[]>;
  findByUserAndDate(userId: string, date: Date): Promise<MealDishWithDish[]>;
  findByUserAndPeriod(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<MealWithDishes[]>;
}
