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

  async getIngredientById(id: string): Promise<IngredientWithRelations | null> {
    const IngredientId = parseInt(id);
    return await this.ingredientRepository.findById(IngredientId);
  }

  async createIngredient(dto: CreateIngredientDto): Promise<Ingredient> {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new Error("Ingredient name is required");
    }

    const repositoryInput: CreateIngredientRepositoryInput = { ...dto };
    return await this.ingredientRepository.create(repositoryInput);
  }

  async updateIngredient(
    id: string,
    dto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    const IngredientId = parseInt(id);
    const repositoryInput: UpdateIngredientRepositoryInput = { ...dto };

    return await this.ingredientRepository.update(
      IngredientId,
      repositoryInput,
    );
  }

  async deleteIngredient(id: string): Promise<void> {
    const IngredientId = parseInt(id);
    await this.ingredientRepository.delete(IngredientId);
  }
}
