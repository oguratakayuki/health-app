import { Nutrient } from "./Nutrient"
import { Dish } from "./Dish"
import { IngredientNutrient } from "./IngredientNutrient"

export interface Ingredient {
  id: string;
  name: string | null;
  remarks: string | null;
  originalName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIngredientInput {
  name: string;
  remarks?: string;
  originalName?: string;
}

export interface UpdateIngredientInput {
  name?: string;
  remarks?: string;
  originalName?: string;
}

export interface IngredientWithRelations extends Ingredient {
  nutrients?: Nutrient[];
  dishes?: Dish[];
  ingredientNutrients?: IngredientNutrient[];
}
