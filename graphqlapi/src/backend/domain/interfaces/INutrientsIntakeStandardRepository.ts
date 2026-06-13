import {
  NutrientsIntakeStandard,
  NutrientsIntakeStandardWithRelations,
  CreateNutrientsIntakeStandardRepositoryInput,
  UpdateNutrientsIntakeStandardRepositoryInput,
  FindAllWithFiltersOptionsRepositoryInput,
} from "@/backend/domain/entities/NutrientsIntakeStandard";
import { Gender } from "@/backend/domain/types/Gender";

export interface INutrientsIntakeStandardRepository {
  findById(id: string): Promise<NutrientsIntakeStandardWithRelations | null>;
  findAll(): Promise<NutrientsIntakeStandard[]>;
  findByNutrientId(nutrientId: number): Promise<NutrientsIntakeStandard[]>;
  create(
    data: CreateNutrientsIntakeStandardRepositoryInput,
  ): Promise<NutrientsIntakeStandard>;
  update(
    id: string,
    data: UpdateNutrientsIntakeStandardRepositoryInput,
  ): Promise<NutrientsIntakeStandard>;
  delete(id: string): Promise<boolean>;
  findAllWithRelations(): Promise<NutrientsIntakeStandardWithRelations[]>;
  findAllWithFilters(
    options: FindAllWithFiltersOptionsRepositoryInput,
  ): Promise<NutrientsIntakeStandard[]>;
  findByGenderAndAge(
    gender: Gender,
    age: number,
  ): Promise<NutrientsIntakeStandardWithRelations[]>;
}
