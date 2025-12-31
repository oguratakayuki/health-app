// src/shared/interfaces/INutrientRepository.ts
import {
  Nutrient,
  CreateNutrientInput,
  UpdateNutrientInput,
} from "@/backend/domain/entities/Nutrient";

export interface INutrientRepository {
  // 基本的なCRUD操作
  findById(id: string): Promise<Nutrient | null>;
  findAll(): Promise<Nutrient[]>;
  create(nutrient: CreateNutrientInput): Promise<Nutrient>;
  update(id: string, nutrient: UpdateNutrientInput): Promise<Nutrient>;
  delete(id: string): Promise<boolean>;
  // 検索・フィルタリング
  findByName(name: string): Promise<Nutrient[]>;
  findByParentId(parentId: string | null): Promise<Nutrient[]>;
  count(): Promise<number>;
}
