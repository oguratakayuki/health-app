/**
 * 材料-栄養素中間テーブルの作成用入力型
 */
export interface CreateIngredientNutrientDto {
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
export interface UpdateIngredientNutrientDto {
  contentQuantity?: number | null;
  contentUnit?: string | null;
  contentUnitPer?: number | null;
  contentUnitPerUnit?: string | null;
}
