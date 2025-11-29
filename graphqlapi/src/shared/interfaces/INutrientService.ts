// src/shared/interfaces/INutrientService.ts
import { 
  Nutrient, 
  CreateNutrientInput, 
  UpdateNutrientInput 
} from '../types/Nutrient';

export interface INutrientService {
  getNutrient(id: string): Promise<Nutrient | null>;
  getAllNutrients(): Promise<Nutrient[]>;
  createNutrient(nutrient: CreateNutrientInput): Promise<Nutrient>;
  updateNutrient(id: string, nutrient: UpdateNutrientInput): Promise<Nutrient>;
  deleteNutrient(id: string): Promise<boolean>;
  searchNutrientsByName(name: string): Promise<Nutrient[]>;
  getNutrientsByParent(parentId: string | null): Promise<Nutrient[]>;
  getNutrientsCount(): Promise<number>;
}
