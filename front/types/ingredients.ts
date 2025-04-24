import { Nutrient } from "./nutrient";
import { Tag } from "./tag";

export interface IngredientTag {
  id?: number;
  tag?: Tag;
  _destroy?: boolean; // 削除フラグ
}
export interface IngredientNutrient {
  id?: number;
  content_quantity: number;
  content_unit: string;
  content_unit_per: number;
  content_unit_per_unit: string;
  nutrient?: Nutrient;
  _destroy?: boolean; // 削除フラグ
}

export interface Ingredient {
  id?: number;
  name: string;
  remarks: string;
  original_name: string;
  ingredient_nutrients?: IngredientNutrient[]; // オプショナルプロパティ
  ingredient_tags?: IngredientTag[]; // オプショナルプロパティ
}

export interface IngredientResponse {
  message: string;
  ingredient: Ingredient;
}
