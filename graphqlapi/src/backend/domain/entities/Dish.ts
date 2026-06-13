import { DishIngredient } from "./DishIngredient";

export interface Dish {
  id: number;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DishWithIngredients extends Dish {
  dishIngredients: DishIngredient[];
}

export interface DishWithIngredients extends Dish {
  dishIngredients: DishIngredient[];
}

export interface CreateDishRepositoryInput {
  name: string;
}

export interface UpdateDishRepositoryInput {
  name?: string;
}
