import {
  Ingredient,
  CreateIngredientInput,
  UpdateIngredientInput,
  IngredientWithRelations,
} from "@/backend/domain/entities/Ingredient";

export interface IIngredientRepository {
  findAll(): Promise<IngredientWithRelations[]>;
  findById(id: bigint): Promise<IngredientWithRelations | null>;
  create(ingredient: CreateIngredientData): Promise<Ingredient>;
  update(id: bigint, ingredient: Partial<Ingredient>): Promise<Ingredient>;

  delete(id: bigint): Promise<void>;
  findByName(name: string): Promise<Ingredient[]>;
  // searchByName(keyword: string): Promise<Ingredient[]>;
  count(): Promise<number>;
}
