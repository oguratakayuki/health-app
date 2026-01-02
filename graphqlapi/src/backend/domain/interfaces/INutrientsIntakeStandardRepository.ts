import {
  NutrientsIntakeStandard,
  NutrientsIntakeStandardWithRelations,
} from "@/backend/domain/entities/NutrientsIntakeStandard";

// 作成・更新用の入力型定義
export interface CreateNutrientsIntakeStandardInput {
  nutrientId: number;
  content: number;
  unit: string; // "g", "mg" などの文字列
  gender: string; // "male", "female" などの文字列
  ageFrom?: number;
  ageTo?: number;
}

export interface UpdateNutrientsIntakeStandardInput {
  nutrientId?: number;
  content?: number;
  unit?: string;
  gender?: string;
  ageFrom?: number;
  ageTo?: number;
}

export interface INutrientsIntakeStandardRepository {
  findById(id: string): Promise<NutrientsIntakeStandardWithRelations | null>;
  findAll(): Promise<NutrientsIntakeStandard[]>;
  findByNutrientId(nutrientId: number): Promise<NutrientsIntakeStandard[]>;
  // create(
  //   data: CreateNutrientsIntakeStandardInput,
  // ): Promise<NutrientsIntakeStandard>;
  update(
    id: string,
    data: UpdateNutrientsIntakeStandardInput,
  ): Promise<NutrientsIntakeStandard>;
  delete(id: string): Promise<boolean>;
  // count(): Promise<number>;
  findAllWithRelations(): Promise<NutrientsIntakeStandardWithRelations[]>;
}
