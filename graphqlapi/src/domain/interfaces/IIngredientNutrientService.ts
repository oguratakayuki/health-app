// src/domain/interfaces/IIngredientNutrientService.ts
import { IngredientNutrientWithRelations } from "@/domain/entities/IngredientNutrient";

export interface IIngredientNutrientService {
  getIngredientNutrients(
    limit?: number,
  ): Promise<IngredientNutrientWithRelations[]>;
}
