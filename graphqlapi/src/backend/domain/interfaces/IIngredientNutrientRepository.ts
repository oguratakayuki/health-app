import {
  IngredientNutrient,
  IngredientNutrientWithRelations,
  CreateIngredientNutrientRepositoryInput,
  UpdateIngredientNutrientRepositoryInput,
} from "@/backend/domain/entities/IngredientNutrient";

export interface IIngredientNutrientRepository {
  findById(id: bigint): Promise<IngredientNutrientWithRelations | null>;
  findAll(limit?: number): Promise<IngredientNutrientWithRelations[]>;
  findByIngredientId(
    ingredientId: number,
  ): Promise<IngredientNutrientWithRelations[]>;
  // findByNutrientId(nutrientId: bigint): Promise<IngredientNutrient[]>;
  create(
    input: CreateIngredientNutrientRepositoryInput,
  ): Promise<IngredientNutrientWithRelations>;
  update(
    id: bigint,
    input: UpdateIngredientNutrientRepositoryInput,
  ): Promise<IngredientNutrient>;
  // delete(id: bigint): Promise<void>;
  // deleteByIngredientId(ingredientId: bigint): Promise<void>;
}
