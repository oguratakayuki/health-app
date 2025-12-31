import { Ingredient } from "./Ingredient"
export interface DishIngredient {
  id: string;
  dishId: string;
  ingredientId: string;
  contentQuantity: number;
  contentUnit: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DishIngredientWithDetails extends DishIngredient {
  ingredient: Ingredient;
}

export interface CreateDishIngredientInput {
  dishId: string;
  ingredientId: string;
  contentQuantity: number;
  contentUnit: string;
}
