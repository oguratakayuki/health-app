import {
  // IngredientNutrient,
  CreateIngredientNutrientInput,
  // UpdateIngredientNutrientInput,
  IngredientNutrientWithRelations,
} from "@/backend/domain/entities/IngredientNutrient";

export interface IIngredientNutrientRepository {
  findById(id: bigint): Promise<IngredientNutrientWithRelations | null>;
  findAll(limit?: number): Promise<IngredientNutrientWithRelations[]>;
  findByIngredientId(
    ingredientId: string,
  ): Promise<IngredientNutrientWithRelations[]>;
  // findByNutrientId(nutrientId: bigint): Promise<IngredientNutrient[]>;
  create(
    input: CreateIngredientNutrientInput,
  ): Promise<IngredientNutrientWithRelations>;
  // update(id: bigint, input: UpdateIngredientNutrientInput): Promise<IngredientNutrient>;
  // delete(id: bigint): Promise<void>;
  // deleteByIngredientId(ingredientId: bigint): Promise<void>;
}
