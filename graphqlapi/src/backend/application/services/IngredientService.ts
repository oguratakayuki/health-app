import { IIngredientService } from "@/backend/domain/interfaces/IIngredientService";
import {
  Ingredient,
  IngredientWithRelations,
  CreateIngredientRepositoryInput,
  UpdateIngredientRepositoryInput,
} from "@/backend/domain/entities/Ingredient";
import { IIngredientRepository } from "@/backend/domain/interfaces/IIngredientRepository";
import {
  CreateIngredientDto,
  UpdateIngredientDto,
} from "@/backend/application/dtos/Ingredient";

export class IngredientService implements IIngredientService {
  private ingredientRepository: IIngredientRepository;

  constructor(ingredientRepository: IIngredientRepository) {
    this.ingredientRepository = ingredientRepository;
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    return await this.ingredientRepository.findAll();
  }

  async getIngredientById(id: bigint): Promise<IngredientWithRelations | null> {
    return await this.ingredientRepository.findById(id);
  }

  async createIngredient(dto: CreateIngredientDto): Promise<Ingredient> {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new Error("Ingredient name is required");
    }

    const repositoryInput: CreateIngredientRepositoryInput = { ...dto };
    return await this.ingredientRepository.create(repositoryInput);
  }

  async updateIngredient(
    id: bigint,
    dto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    const repositoryInput: UpdateIngredientRepositoryInput = { ...dto };

    return await this.ingredientRepository.update(id, repositoryInput);
  }

  async deleteIngredient(id: bigint): Promise<void> {
    await this.ingredientRepository.delete(id);
  }
}
