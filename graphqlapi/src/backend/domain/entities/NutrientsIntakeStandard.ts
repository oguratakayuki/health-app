// src/backend/domain/entities/NutrientsIntakeStandard.ts

export const NUTRIENT_UNIT_LABELS = [
  "g",
  "mg",
  "mgNE",
  "μgRAE",
  "ug",
  "kcal",
  "％エネルギー",
] as const;

export const GENDER_LABELS = ["male", "female"] as const;

// 型定義
export type NutrientUnit = (typeof NUTRIENT_UNIT_LABELS)[number];
export type Gender = (typeof GENDER_LABELS)[number];

export interface NutrientsIntakeStandard {
  id: string;
  nutrientId: number;
  content: number;
  unit: NutrientUnit;
  gender: Gender;
  ageFrom: number;
  ageTo: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutrientsIntakeStandardWithRelations extends NutrientsIntakeStandard {
  nutrient?: any;
}

export interface CreateNutrientsIntakeStandardRepositoryInput {
  nutrientId: number;
  content: number;
  unit: NutrientUnit;
  gender: Gender;
  ageFrom: number;
  ageTo: number;
}

/**
 * 更新用入力型
 */
export interface UpdateNutrientsIntakeStandardRepositoryInput {
  nutrientId: number;
  content: number;
  unit: NutrientUnit;
  gender: Gender;
  ageFrom: number;
  ageTo: number;
}

export interface FindAllWithFiltersOptionsRepositoryInput {
  gender?: string;
  age?: number;
}

export interface GetStandardsOptionsRepositoryInput {
  gender: string;
  age: number;
  // 将来的に追加
  // userId?: string;
}
