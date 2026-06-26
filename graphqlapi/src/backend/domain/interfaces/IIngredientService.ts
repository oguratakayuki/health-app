// import { Ingredient, IngredientWithRelations } from '../types/Ingredient';
import {
  Ingredient,
  IngredientWithRelations,
} from "@/backend/domain/entities/Ingredient";

import {
  CreateIngredientDto,
  UpdateIngredientDto,
} from "@/backend/application/dtos/Ingredient";

export interface IIngredientService {
  getAllIngredients(): Promise<Ingredient[]>;
  getIngredientById(id: string): Promise<IngredientWithRelations | null>;
  createIngredient(ingredient: CreateIngredientDto): Promise<Ingredient>;
  updateIngredient(id: string, dto: UpdateIngredientDto): Promise<Ingredient>;
  deleteIngredient(id: string): Promise<void>;
}
