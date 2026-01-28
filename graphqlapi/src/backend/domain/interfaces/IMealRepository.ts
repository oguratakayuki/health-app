// src/backend/domain/interfaces/IMealRepository.ts
import { DailyNutrientSummary } from "@/backend/domain/entities/NutrientSummary";
export interface IMealRepository {
  // 既存のメソッド（例）
  // findById(id: number): Promise<Meal | null>;
  // findByUserId(userId: number): Promise<Meal[]>;
  // create(meal: CreateMealInput): Promise<Meal>;
  // update(id: number, meal: UpdateMealInput): Promise<Meal>;
  // delete(id: number): Promise<void>;
  // 栄養素集計関連のメソッド
  getDailyNutrientSummary(
    userId: number,
    date: Date,
  ): Promise<DailyNutrientSummary[]>;
  // getMealsWithDetailsByDateRange(
  //   userId: number,
  //   startDate: Date,
  //   endDate: Date
  // ): Promise<MealWithDetails[]>;
}
