import { Nutrient } from "./Nutrient";
import { Dish } from "./Dish";
import { IngredientNutrient } from "./IngredientNutrient";

export interface Ingredient {
  id: string;
  name: string;
  remarks: string | null;
  originalName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIngredientRepositoryInput {
  name: string;
  remarks?: string;
  originalName?: string;
}

export interface UpdateIngredientRepositoryInput {
  name?: string;
  remarks?: string;
  originalName?: string;
}

export interface IngredientWithRelations extends Ingredient {
  nutrients?: Nutrient[];
  dishes?: Dish[];
  ingredientNutrients?: IngredientNutrient[];
}
