import { Ingredient } from "./Ingredient";
import { Nutrient } from "./Nutrient";

/**
 * 材料-栄養素中間テーブルのエンティティ型
 */
export interface IngredientNutrient {
  id: string;
  ingredientId: string;
  nutrientId: string;
  ingredient: Ingredient | null;
  nutrient: Nutrient | null;
  contentQuantity: number | null;
  contentUnit: string | null;
  contentUnitPer: number | null;
  contentUnitPerUnit: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IngredientNutrientWithRelations extends IngredientNutrient {
  id: string;
  ingredientId: string;
  nutrientId: string;
  contentQuantity: number | null;
  contentUnit: string | null;
  contentUnitPer: number | null;
  contentUnitPerUnit: string | null;
  createdAt: Date;
  updatedAt: Date;
  ingredient: {
    id: string;
    name: string | null;
    originalName: string | null;
    remarks: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null; // null を許可（undefined ではなく）
  nutrient: {
    id: string;
    name: string;
    code: string;
    parentId?: bigint | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * 材料-栄養素中間テーブルの作成用入力型
 */
export interface CreateIngredientNutrientInput {
  ingredientId: bigint;
  nutrientId: bigint;
  contentQuantity?: number | null;
  contentUnit?: string | null;
  contentUnitPer?: number | null;
  contentUnitPerUnit?: string | null;
}

/**
 * 材料-栄養素中間テーブルの更新用入力型
 */
export interface UpdateIngredientNutrientInput {
  contentQuantity?: number | null;
  contentUnit?: string | null;
  contentUnitPer?: number | null;
  contentUnitPerUnit?: string | null;
}
