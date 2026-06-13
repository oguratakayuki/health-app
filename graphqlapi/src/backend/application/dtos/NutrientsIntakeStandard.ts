import {
  NutrientUnit,
  Gender,
} from "@/backend/domain/entities/NutrientsIntakeStandard";

/**
 * 作成用入力型
 */
export interface CreateNutrientsIntakeStandardDto {
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
export interface UpdateNutrientsIntakeStandardDto {
  nutrientId: number;
  content: number;
  unit: NutrientUnit;
  gender: Gender;
  ageFrom: number;
  ageTo: number;
}

export interface FindAllWithFiltersOptionsDto {
  gender?: string;
  age?: number;
}

export interface GetStandardsOptionsDto {
  gender: string;
  age: number;
  // 将来的に追加
  // userId?: string;
}
