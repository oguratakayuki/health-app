import {
  IIngredientService,
  CreateIngredientData,
} from "@/backend/domain/interfaces/IIngredientService";
import {
  Ingredient,
  IngredientWithRelations,
} from "@/backend/domain/entities/Ingredient";
import { IIngredientRepository } from "@/backend/domain/interfaces/IIngredientRepository";

export class IngredientService implements IIngredientService {
  private ingredientRepository: IIngredientRepository;

  constructor(ingredientRepository: IIngredientRepository) {
    this.ingredientRepository = ingredientRepository;
  }

  async getAllIngredients(): Promise<IngredientWithRelations[]> {
    console.log("getAllIngredients !!!!!!!!!!!!!!!!!1");
    return await this.ingredientRepository.findAll();
  }

  async getIngredientById(id: bigint): Promise<IngredientWithRelations | null> {
    return await this.ingredientRepository.findById(id);
  }

  async createIngredient(
    ingredientData: CreateIngredientData,
  ): Promise<Ingredient> {
    if (!ingredientData.name || ingredientData.name.trim().length === 0) {
      throw new Error("Ingredient name is required");
    }
    // undefinedをnullに変換
    const data = {
      name: this.normalizeString(ingredientData.name),
      remarks: this.normalizeString(ingredientData.remarks),
      originalName: this.normalizeString(ingredientData.originalName),
    };
    return await this.ingredientRepository.create(data);
  }

  async updateIngredient(
    id: bigint,
    ingredientData: Partial<Ingredient>,
  ): Promise<Ingredient> {
    // 更新時も正規化
    const updateData: Partial<Ingredient> = {};
    if (ingredientData.name !== undefined) {
      const normalized = this.normalizeString(ingredientData.name);
      if (!normalized) {
        throw new Error("Ingredient name cannot be empty");
      }
      if (normalized.length > 100) {
        throw new Error("Ingredient name cannot exceed 100 characters");
      }
      updateData.name = normalized;
    }
    if (ingredientData.remarks !== undefined) {
      updateData.remarks = this.normalizeString(ingredientData.remarks);
    }
    if (ingredientData.originalName !== undefined) {
      updateData.originalName = this.normalizeString(
        ingredientData.originalName,
      );
    }
    return await this.ingredientRepository.update(id, updateData);
  }

  async deleteIngredient(id: bigint): Promise<void> {
    await this.ingredientRepository.delete(id);
  }

  private normalizeString(value: string | null | undefined): string | null {
    if (value === undefined || value === null) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }
}
