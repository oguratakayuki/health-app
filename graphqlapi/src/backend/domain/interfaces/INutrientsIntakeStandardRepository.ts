import {
  NutrientsIntakeStandard,
  NutrientsIntakeStandardWithRelations,
} from "@/backend/domain/entities/NutrientsIntakeStandard";
import { Gender } from "@/backend/domain/types/Gender";

import {
  CreateNutrientsIntakeStandardDto,
  UpdateNutrientsIntakeStandardDto,
  FindAllWithFiltersOptionsDto,
} from "@/backend/application/dtos/NutrientsIntakeStandard";

export interface INutrientsIntakeStandardRepository {
  findById(id: string): Promise<NutrientsIntakeStandardWithRelations | null>;
  findAll(): Promise<NutrientsIntakeStandard[]>;
  findByNutrientId(nutrientId: number): Promise<NutrientsIntakeStandard[]>;
  create(
    data: CreateNutrientsIntakeStandardDto,
  ): Promise<NutrientsIntakeStandard>;
  update(
    id: string,
    data: UpdateNutrientsIntakeStandardDto,
  ): Promise<NutrientsIntakeStandard>;
  delete(id: string): Promise<boolean>;
  findAllWithRelations(): Promise<NutrientsIntakeStandardWithRelations[]>;
  findAllWithFilters(
    options: FindAllWithFiltersOptionsDto,
  ): Promise<NutrientsIntakeStandard[]>;
  findByGenderAndAge(
    gender: Gender,
    age: number,
  ): Promise<NutrientsIntakeStandardWithRelations[]>;
}
