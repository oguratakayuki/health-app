import {
  Ingredient,
  IngredientWithRelations,
} from "@/backend/domain/entities/Ingredient";
import {
  CreateIngredientRepositoryInput,
  UpdateIngredientRepositoryInput,
} from "@/backend/domain/entities/Ingredient";

export interface IIngredientRepository {
  findAll(): Promise<IngredientWithRelations[]>;
  findById(id: number): Promise<IngredientWithRelations | null>;
  create(ingredient: CreateIngredientRepositoryInput): Promise<Ingredient>;
  update(
    id: number,
    ingredient: UpdateIngredientRepositoryInput,
  ): Promise<Ingredient>;

  delete(id: number): Promise<void>;
  findByName(name: string): Promise<Ingredient[]>;
  // searchByName(keyword: string): Promise<Ingredient[]>;
  count(): Promise<number>;
}
