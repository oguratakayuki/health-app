/**
 * 材料-栄養素中間テーブルのエンティティ型
 */
export interface IngredientNutrient {
  id: bigint;
  ingredientId: bigint | null;
  nutrientId: bigint | null;
  contentQuantity: number | null;
  contentUnit: string | null;
  contentUnitPer: number | null;
  contentUnitPerUnit: string | null;
  createdAt: Date;
  updatedAt: Date;
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

/**
 * 栄養素情報を含む材料-栄養素中間テーブルの型
 */
export interface IngredientNutrientWithNutrient extends IngredientNutrient {
  nutrient?: {
    id: bigint;
    name: string | null;
    parentId: bigint | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * 材料情報を含む材料-栄養素中間テーブルの型
 */
export interface IngredientNutrientWithIngredient extends IngredientNutrient {
  ingredient?: {
    id: bigint;
    name: string | null;
    remarks: string | null;
    originalName: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}
