// src/application/services/IngredientNutrientService.ts
import { IIngredientNutrientService } from "@/domain/interfaces/IIngredientNutrientService";
import { IIngredientNutrientRepository } from "@/domain/interfaces/IIngredientNutrientRepository";
import { IngredientNutrientWithRelations } from "@/domain/entities/IngredientNutrient";

export class IngredientNutrientService implements IIngredientNutrientService {
  private ingredientNutrientRepository: IIngredientNutrientRepository;

  constructor(ingredientNutrientRepository: IIngredientNutrientRepository) {
    this.ingredientNutrientRepository = ingredientNutrientRepository;
  }

  async getIngredientNutrients(
    limit?: number,
  ): Promise<IngredientNutrientWithRelations[]> {
    try {
      return await this.ingredientNutrientRepository.findAll(limit);
    } catch (error) {
      console.error(`Error in getIngredientNutrients: ${error}`);
      throw new Error("材料栄養素の取得に失敗しました");
    }
  }
}
