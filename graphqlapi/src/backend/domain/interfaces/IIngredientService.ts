// import { Ingredient, IngredientWithRelations } from '../types/Ingredient';
import {
  Ingredient,
  IngredientWithRelations,
} from "@/backend/domain/entities/Ingredient";

export interface CreateIngredientData {
  name?: string | null;
  remarks?: string | null;
  originalName?: string | null;
}

export interface IIngredientService {
  getAllIngredients(): Promise<IngredientWithRelations[]>;
  getIngredientById(id: bigint): Promise<IngredientWithRelations | null>;
  createIngredient(ingredient: CreateIngredientData): Promise<Ingredient>;
  updateIngredient(
    id: bigint,
    ingredient: Partial<Ingredient>,
  ): Promise<Ingredient>;
  deleteIngredient(id: bigint): Promise<void>;
}
