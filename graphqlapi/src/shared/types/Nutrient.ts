// src/shared/types/Nutrient.ts
import { IngredientNutrient } from "./IngredientNutrient"

export interface Nutrient {
  id: string;
  name: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNutrientInput {
  name: string;
  parentId?: string | null;
}

export interface UpdateNutrientInput {
  name?: string;
  parentId?: string | null;
}

// 材料-栄養素情報を含む栄養素の型
export interface NutrientWithIngredientNutrients extends Nutrient {
  ingredientNutrients?: IngredientNutrient[];
}
