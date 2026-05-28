import {
  Meal,
  CreateMealInput,
  MealWithDishes,
  MealDishWithDish,
} from "@/backend/domain/entities/Meal";

export interface IMealService {
  createMealWithDishes(input: CreateMealInput): Promise<Meal>;
  getMealWithDishes(id: number): Promise<MealWithDishes | null>;
  getAllMealsWithDishes(
    userId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<MealWithDishes[]>;
  updateMeal(id: string, input: UpdateMealInput): Promise<Meal>;
  deleteMeal(id: string): Promise<boolean>;
}
