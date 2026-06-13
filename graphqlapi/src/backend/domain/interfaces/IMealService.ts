import { Meal, MealWithDishes } from "@/backend/domain/entities/Meal";

import { CreateMealDto, UpdateMealDto } from "@/backend/application/dtos/Meal";

export interface IMealService {
  createMealWithDishes(input: CreateMealDto): Promise<Meal>;
  getMealWithDishes(id: number): Promise<MealWithDishes | null>;
  getAllMealsWithDishes(
    userId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<MealWithDishes[]>;
  updateMeal(id: string, input: UpdateMealDto): Promise<MealWithDishes | null>;
  deleteMeal(id: string): Promise<boolean>;
}
