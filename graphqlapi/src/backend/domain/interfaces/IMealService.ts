import { Meal, CreateMealInput, MealWithDishes } from "@/backend/domain/entities/Meal";

export interface IMealService {
  createMealWithDishes(input: CreateMealInput): Promise<Meal>;
  getMealWithDishes(id: number): Promise<MealWithDishes | null>;
}
