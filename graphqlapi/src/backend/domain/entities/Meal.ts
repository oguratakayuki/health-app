// src/backend/domain/entities/Meal.ts
import { DishWithIngredients } from "src/backend/domain/entities/Dish";
export interface Meal {
  id: number;
  userId: number;
  mealDate: Date;
  startTime: string | null;
  endTime: string | null;
  category: string; // 'breakfast', 'lunch', 'dinner', 'snack'
  createdAt: Date;
  updatedAt: Date;
  // 関連エンティティ（オプション、循環参照を避ける）
  dishIds?: number[];
}

export interface MealDishInput {
  id?: number;
  name?: string;
}

// 入力用DTO
export interface CreateMealInput {
  userId: number;
  mealDate: Date;
  category: string;
  dishes: MealDishInput[];
}

export interface UpdateMealInput {
  mealDate?: Date;
  category?: string;
  dishIds?: number[];
}

export interface MealWithDishes extends Meal {
  dishes: DishWithIngredients[];
  mealDishes?: any[];
}

export interface MealDishWithDish extends Meal {
  dish: DishWithIngredients;
}

export interface MealDishWithDish extends Meal {
  dish: DishWithIngredients;
}
