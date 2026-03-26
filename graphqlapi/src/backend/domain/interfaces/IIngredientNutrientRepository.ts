import {
  // IngredientNutrient,
  // CreateIngredientNutrientInput,
  // UpdateIngredientNutrientInput,
  IngredientNutrient,
  IngredientNutrientWithRelations,
} from "@/backend/domain/entities/IngredientNutrient";

export interface IIngredientNutrientRepository {
  findById(id: bigint): Promise<IngredientNutrient | null>;
  findAll(limit?: number): Promise<IngredientNutrientWithRelations[]>;
  findByIngredientId(ingredientId: string): Promise<IngredientNutrient[]>;
  // findByNutrientId(nutrientId: bigint): Promise<IngredientNutrient[]>;
  // create(input: CreateIngredientNutrientInput): Promise<IngredientNutrient>;
  // update(id: bigint, input: UpdateIngredientNutrientInput): Promise<IngredientNutrient>;
  // delete(id: bigint): Promise<void>;
  // deleteByIngredientId(ingredientId: bigint): Promise<void>;
}
