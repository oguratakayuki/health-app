import {
  IngredientNutrient,
  IngredientNutrientWithRelations,
} from "@/backend/domain/entities/IngredientNutrient";
import {
  CreateIngredientNutrientDto,
  UpdateIngredientNutrientDto,
} from "@/backend/application/dtos/IngredientNutrient";

export interface IIngredientNutrientRepository {
  findById(id: bigint): Promise<IngredientNutrientWithRelations | null>;
  findAll(limit?: number): Promise<IngredientNutrientWithRelations[]>;
  findByIngredientId(
    ingredientId: string,
  ): Promise<IngredientNutrientWithRelations[]>;
  // findByNutrientId(nutrientId: bigint): Promise<IngredientNutrient[]>;
  create(
    input: CreateIngredientNutrientDto,
  ): Promise<IngredientNutrientWithRelations>;
  update(
    id: bigint,
    input: UpdateIngredientNutrientDto,
  ): Promise<IngredientNutrient>;
  // delete(id: bigint): Promise<void>;
  // deleteByIngredientId(ingredientId: bigint): Promise<void>;
}
