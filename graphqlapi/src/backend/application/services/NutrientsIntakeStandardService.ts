import { INutrientsIntakeStandardService } from "@/backend/domain/interfaces/INutrientsIntakeStandardService";
import {
  NutrientsIntakeStandard,
  NutrientsIntakeStandardWithRelations,
  CreateNutrientsIntakeStandardRepositoryInput,
  UpdateNutrientsIntakeStandardRepositoryInput,
  GetStandardsOptionsRepositoryInput,
} from "@/backend/domain/entities/NutrientsIntakeStandard";
import {
  CreateNutrientsIntakeStandardDto,
  UpdateNutrientsIntakeStandardDto,
  GetStandardsOptionsDto,
} from "@/backend/application/dtos/NutrientsIntakeStandard";

import { INutrientsIntakeStandardRepository } from "@/backend/domain/interfaces/INutrientsIntakeStandardRepository";

export class NutrientsIntakeStandardService implements INutrientsIntakeStandardService {
  constructor(private standardRepository: INutrientsIntakeStandardRepository) {}

  async getStandard(
    id: string,
  ): Promise<NutrientsIntakeStandardWithRelations | null> {
    try {
      return await this.standardRepository.findById(id);
    } catch (error) {
      console.error("NutrientsIntakeStandardService.getStandard error:", error);
      throw new Error(
        `Failed to get standard: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * 性別・年齢でフィルタリングした栄養摂取基準を取得
   */
  async findAllWithFilters(
    dto: GetStandardsOptionsDto,
  ): Promise<NutrientsIntakeStandard[]> {
    const repositoryInput: GetStandardsOptionsRepositoryInput = {
      ...dto,
    };
    return this.standardRepository.findAllWithFilters(repositoryInput);
  }

  async getAllStandards(): Promise<NutrientsIntakeStandard[]> {
    try {
      return await this.standardRepository.findAll();
    } catch (error) {
      console.error(
        "NutrientsIntakeStandardService.getAllStandards error:",
        error,
      );
      throw new Error(
        `Failed to get standards: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getStandardsByNutrientId(
    nutrientId: number,
  ): Promise<NutrientsIntakeStandard[]> {
    try {
      return await this.standardRepository.findByNutrientId(nutrientId);
    } catch (error) {
      console.error(
        "NutrientsIntakeStandardService.getStandardsByNutrientId error:",
        error,
      );
      throw new Error(
        `Failed to get standards by nutrient: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async createStandard(
    dto: CreateNutrientsIntakeStandardDto,
  ): Promise<NutrientsIntakeStandard> {
    try {
      // 簡易的なバリデーション
      if (!dto.nutrientId) {
        throw new Error("Nutrient ID is required");
      }
      if (dto.content === undefined || dto.content === null) {
        throw new Error("Content value is required");
      }
      const repositoryInput: CreateNutrientsIntakeStandardRepositoryInput = {
        ...dto,
      };
      return await this.standardRepository.create(repositoryInput);
    } catch (error) {
      console.error(
        "NutrientsIntakeStandardService.createStandard error:",
        error,
      );
      throw new Error(
        `Failed to create standard: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async updateStandard(
    id: string,
    dto: UpdateNutrientsIntakeStandardDto,
  ): Promise<NutrientsIntakeStandard> {
    try {
      const existing = await this.standardRepository.findById(id);
      if (!existing) {
        throw new Error(`Standard with id ${id} not found`);
      }
      const repositoryInput: UpdateNutrientsIntakeStandardRepositoryInput = {
        ...dto,
      };
      return await this.standardRepository.update(id, repositoryInput);
    } catch (error) {
      console.error(
        "NutrientsIntakeStandardService.updateStandard error:",
        error,
      );
      throw new Error(
        `Failed to update standard: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async deleteStandard(id: string): Promise<boolean> {
    try {
      const existing = await this.standardRepository.findById(id);
      if (!existing) {
        throw new Error(`Standard with id ${id} not found`);
      }

      return await this.standardRepository.delete(id);
    } catch (error) {
      console.error(
        "NutrientsIntakeStandardService.deleteStandard error:",
        error,
      );
      throw new Error(
        `Failed to delete standard: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getAllStandardsWithRelations(): Promise<
    NutrientsIntakeStandardWithRelations[]
  > {
    try {
      return await this.standardRepository.findAllWithRelations();
    } catch (error) {
      console.error(
        "NutrientsIntakeStandardService.getAllStandardsWithRelations error:",
        error,
      );
      throw new Error(
        `Failed to get standards with relations: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
