// src/backend/domain/entities/Meal.ts
import { DishWithIngredients } from "@/backend/domain/entities/Dish";
import { MealDish } from "@/backend/domain/entities/MealDish";
export interface Meal {
  id: number;
  userId: number;
  mealDate: Date;
  startTime: Date; // prismaの仕様
  endTime: Date; // prismaの仕様
  category: string; // 'breakfast', 'lunch', 'dinner', 'snack'
  createdAt: Date;
  updatedAt: Date;
  // 関連エンティティ（オプション、循環参照を避ける）
  dishIds?: number[];
}

export interface MealWithDishes extends Meal {
  mealDishes: MealDishWithDish[];
  dishes: DishWithIngredients[];
}

export interface MealDishWithDish extends Meal {
  dish: DishWithIngredients;
}

export interface UpdateMealRepositoryInput {
  mealDate: Date;
  category: string;
  startTime: string;
  endTime: string;
}

export interface CreateMealRepositoryInput {
  userId: number;
  mealDate: Date;
  category: string;
  startTime: string;
  endTime: string;
}
