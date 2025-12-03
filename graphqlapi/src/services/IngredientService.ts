import { IIngredientService } from '../shared/interfaces/IIngredientService';
import { IIngredientRepository } from '../shared/interfaces/IIngredientRepository';
import { Ingredient, IngredientWithRelations } from '../shared/types/Ingredient';

export class IngredientService implements IIngredientService {
  private ingredientRepository: IIngredientRepository;

  constructor(ingredientRepository: IIngredientRepository) {
    this.ingredientRepository = ingredientRepository;
  }

  async getAllIngredients(): Promise<IngredientWithRelations[]> {
    return await this.ingredientRepository.findAll();
  }

  async getIngredientById(id: bigint): Promise<IngredientWithRelations | null> {
    return await this.ingredientRepository.findById(id);
  }

  async createIngredient(ingredientData: CreateIngredientData): Promise<Ingredient> {
    // undefinedをnullに変換
    const data = {
      name: ingredientData.name ?? null,
      remarks: ingredientData.remarks ?? null,
      originalName: ingredientData.originalName ?? null
    };
    return await this.ingredientRepository.create(data);
  }

  async updateIngredient(id: bigint, ingredientData: Partial<Ingredient>): Promise<Ingredient> {
    return await this.ingredientRepository.update(id, ingredientData);
  }

  async deleteIngredient(id: bigint): Promise<void> {
    await this.ingredientRepository.delete(id);
  }

}
