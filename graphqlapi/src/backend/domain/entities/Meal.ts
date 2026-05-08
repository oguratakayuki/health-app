// src/backend/domain/entities/Meal.ts
import { DishWithIngredients } from "src/backend/domain/entities/Dish";
export interface Meal {
  id: number;
  userId: number;
  mealDate: Date;
  category: string; // 'breakfast', 'lunch', 'dinner', 'snack'
  createdAt: Date;
  updatedAt: Date;
  // 関連エンティティ（オプション、循環参照を避ける）
  dishIds?: number[];
}

// 入力用DTO
export interface CreateMealInput {
  userId: number;
  mealDate: Date;
  category: string;
  dishIds: number[];
}

export interface UpdateMealInput {
  mealDate?: Date;
  category?: string;
  dishIds?: number[];
}

export interface MealWithDishes extends Meal {
  mealDishes: MealDishWithDish[];
}

export interface MealDishWithDish {
  dish: DishWithIngredients;
}
