import {
  NutrientsIntakeStandard,
  NutrientsIntakeStandardWithRelations,
} from "@/backend/domain/entities/NutrientsIntakeStandard";

import {
  CreateNutrientsIntakeStandardDto,
  UpdateNutrientsIntakeStandardDto,
  GetStandardsOptionsDto,
} from "@/backend/application/dtos/NutrientsIntakeStandard";

export interface INutrientsIntakeStandardService {
  getStandard(id: string): Promise<NutrientsIntakeStandardWithRelations | null>;
  getAllStandards(): Promise<NutrientsIntakeStandard[]>;
  getStandardsByNutrientId(
    nutrientId: number,
  ): Promise<NutrientsIntakeStandard[]>;
  createStandard(
    input: CreateNutrientsIntakeStandardDto,
  ): Promise<NutrientsIntakeStandard>;
  updateStandard(
    id: string,
    input: UpdateNutrientsIntakeStandardDto,
  ): Promise<NutrientsIntakeStandard>;
  deleteStandard(id: string): Promise<boolean>;
  getAllStandardsWithRelations(): Promise<
    NutrientsIntakeStandardWithRelations[]
  >;
  findAllWithFilters(
    options: GetStandardsOptionsDto,
  ): Promise<NutrientsIntakeStandard[]>;
}
