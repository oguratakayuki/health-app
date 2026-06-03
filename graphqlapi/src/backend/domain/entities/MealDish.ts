// src/backend/domain/entities/Meal.ts
import { Dish } from "@/backend/domain/entities/Dish";
export interface MealDish {
  id: number;
  mealId: number;
  dishId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealDishWithDish extends MealDish {
  dish: Dish[];
}
