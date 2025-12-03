import { 
  IngredientNutrient, 
  CreateIngredientNutrientInput, 
  UpdateIngredientNutrientInput,
  IngredientNutrientWithNutrient 
} from '../types/IngredientNutrient';

export interface IIngredientNutrientRepository {
  findByIngredientId(ingredientId: bigint): Promise<IngredientNutrientWithNutrient[]>;
  findByNutrientId(nutrientId: bigint): Promise<IngredientNutrient[]>;
  create(input: CreateIngredientNutrientInput): Promise<IngredientNutrient>;
  update(id: bigint, input: UpdateIngredientNutrientInput): Promise<IngredientNutrient>;
  delete(id: bigint): Promise<void>;
  deleteByIngredientId(ingredientId: bigint): Promise<void>;
}
