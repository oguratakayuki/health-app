import { DishIngredient } from "./DishIngredient"

export interface Dish {
  id: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DishWithIngredients extends Dish {
  dishIngredients: DishIngredient[];
}

export interface CreateDishInput {
  name: string;
}

export interface UpdateDishInput {
  name?: string;
}

export interface DishWithIngredients extends Dish {
  dishIngredients: DishIngredient[];
}
