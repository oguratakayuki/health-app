import { 
  Ingredient, 
  CreateIngredientInput, 
  UpdateIngredientInput 
} from '../types/Ingredient';

export interface IIngredientRepository {
  findById(id: string): Promise<Ingredient | null>;
  findAll(): Promise<Ingredient[]>;
  create(ingredient: CreateIngredientInput): Promise<Ingredient>;
  update(id: string, ingredient: UpdateIngredientInput): Promise<Ingredient>;
  delete(id: string): Promise<boolean>;
  findByName(name: string): Promise<Ingredient[]>;
  searchByName(keyword: string): Promise<Ingredient[]>;
  count(): Promise<number>;
}
