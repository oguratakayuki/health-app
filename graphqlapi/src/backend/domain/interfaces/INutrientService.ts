import { Nutrient } from "@/backend/domain/entities/Nutrient";
import {
  CreateNutrientDto,
  UpdateNutrientDto,
} from "@/backend/application/dtos/Nutrient";

export interface INutrientService {
  getNutrient(id: string): Promise<Nutrient | null>;
  getAllNutrients(): Promise<Nutrient[]>;
  createNutrient(dto: CreateNutrientDto): Promise<Nutrient>;
  updateNutrient(id: string, dto: UpdateNutrientDto): Promise<Nutrient>;
  deleteNutrient(id: string): Promise<boolean>;
  searchNutrientsByName(name: string): Promise<Nutrient[]>;
  getNutrientsByParent(parentId: string | null): Promise<Nutrient[]>;
  getNutrientsCount(): Promise<number>;
}
