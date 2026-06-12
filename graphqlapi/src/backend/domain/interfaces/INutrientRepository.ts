import { Nutrient } from "@/backend/domain/entities/Nutrient";
import {
  CreateNutrientDto,
  UpdateNutrientDto,
} from "@/backend/application/dtos/Nutrient";
export interface INutrientRepository {
  // 基本的なCRUD操作
  findById(id: string): Promise<Nutrient | null>;
  findAll(): Promise<Nutrient[]>;
  create(nutrient: CreateNutrientDto): Promise<Nutrient>;
  update(id: string, nutrient: UpdateNutrientDto): Promise<Nutrient>;
  delete(id: string): Promise<boolean>;
  // 検索・フィルタリング
  findByName(name: string): Promise<Nutrient[]>;
  findByParentId(parentId: string | null): Promise<Nutrient[]>;
  count(): Promise<number>;
}
