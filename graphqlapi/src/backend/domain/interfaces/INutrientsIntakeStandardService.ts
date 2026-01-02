import {
  NutrientsIntakeStandard,
  NutrientsIntakeStandardWithRelations,
  CreateNutrientsIntakeStandardInput,
  UpdateNutrientsIntakeStandardInput,
} from "@/backend/domain/entities/NutrientsIntakeStandard";

export interface INutrientsIntakeStandardService {
  getStandard(id: string): Promise<NutrientsIntakeStandardWithRelations | null>;
  getAllStandards(): Promise<NutrientsIntakeStandard[]>;
  getStandardsByNutrientId(
    nutrientId: number,
  ): Promise<NutrientsIntakeStandard[]>;
  createStandard(
    input: CreateNutrientsIntakeStandardInput,
  ): Promise<NutrientsIntakeStandard>;
  updateStandard(
    id: string,
    input: UpdateNutrientsIntakeStandardInput,
  ): Promise<NutrientsIntakeStandard>;
  deleteStandard(id: string): Promise<boolean>;
  getAllStandardsWithRelations(): Promise<
    NutrientsIntakeStandardWithRelations[]
  >;
}
