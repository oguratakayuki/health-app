// src/backend/domain/entities/NutrientsIntakeStandard.ts

export const NUTRIENT_UNIT_LABELS = [
  "g",
  "mg",
  "mgNE",
  "μgRAE",
  "μg",
  "kcal",
  "％エネルギー",
] as const;

export const GENDER_LABELS = ["male", "female"] as const;

// 型定義
export type NutrientUnit = (typeof NUTRIENT_UNIT_LABELS)[number];
export type Gender = (typeof GENDER_LABELS)[number];

export interface NutrientsIntakeStandard {
  id: string;
  nutrientId: number | null;
  content: number | null;
  unit: NutrientUnit | null;
  gender: Gender | null;
  ageFrom: number | null;
  ageTo: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutrientsIntakeStandardWithRelations extends NutrientsIntakeStandard {
  nutrient?: any;
}

/**
 * 作成用入力型
 */
export interface CreateNutrientsIntakeStandardInput {
  nutrientId: number;
  content: number;
  unit: NutrientUnit | string;
  gender: Gender | string;
  ageFrom?: number | null;
  ageTo?: number | null;
}

/**
 * 更新用入力型
 */
export interface UpdateNutrientsIntakeStandardInput {
  nutrientId?: number;
  content?: number;
  unit?: NutrientUnit | string;
  gender?: Gender | string;
  ageFrom?: number | null;
  ageTo?: number | null;
}
