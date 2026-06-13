// src/services/NutrientService.ts
import { INutrientService } from "@/backend/domain/interfaces/INutrientService";
import {
  Nutrient,
  CreateNutrientRepositoryInput,
  UpdateNutrientRepositoryInput,
} from "@/backend/domain/entities/Nutrient";
import {
  CreateNutrientDto,
  UpdateNutrientDto,
} from "@/backend/application/dtos/Nutrient";
import { INutrientRepository } from "@/backend/domain/interfaces/INutrientRepository";

export class NutrientService implements INutrientService {
  constructor(private nutrientRepository: INutrientRepository) {}
  async getNutrient(id: string): Promise<Nutrient | null> {
    try {
      return await this.nutrientRepository.findById(id);
    } catch (error) {
      console.error("NutrientService.getNutrient error:", error);
      throw new Error(
        `Failed to get nutrient: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getAllNutrients(): Promise<Nutrient[]> {
    try {
      return await this.nutrientRepository.findAll();
    } catch (error) {
      console.error("NutrientService.getAllNutrients error:", error);
      throw new Error(
        `Failed to get nutrients: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async createNutrient(dto: CreateNutrientDto): Promise<Nutrient> {
    try {
      if (!dto.name || dto.name.trim().length === 0) {
        throw new Error("Nutrient name is required");
      }

      const repositoryInput: CreateNutrientRepositoryInput = { ...dto };
      return await this.nutrientRepository.create(repositoryInput);
    } catch (error) {
      console.error("NutrientService.createNutrient error:", error);
      throw new Error(
        `Failed to create nutrient: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async updateNutrient(id: string, dto: UpdateNutrientDto): Promise<Nutrient> {
    try {
      if (dto.name && dto.name.trim().length === 0) {
        throw new Error("Nutrient name cannot be empty");
      }

      const existingNutrient = await this.nutrientRepository.findById(id);
      if (!existingNutrient) {
        throw new Error(`Nutrient with id ${id} not found`);
      }

      const repositoryInput: UpdateNutrientRepositoryInput = { ...dto };
      return await this.nutrientRepository.update(id, repositoryInput);
    } catch (error) {
      console.error("NutrientService.updateNutrient error:", error);
      throw new Error(
        `Failed to update nutrient: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async deleteNutrient(id: string): Promise<boolean> {
    try {
      const existingNutrient = await this.nutrientRepository.findById(id);
      if (!existingNutrient) {
        throw new Error(`Nutrient with id ${id} not found`);
      }

      return await this.nutrientRepository.delete(id);
    } catch (error) {
      console.error("NutrientService.deleteNutrient error:", error);
      throw new Error(
        `Failed to delete nutrient: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async searchNutrientsByName(name: string): Promise<Nutrient[]> {
    try {
      if (!name || name.trim().length === 0) {
        return await this.nutrientRepository.findAll();
      }

      return await this.nutrientRepository.findByName(name);
    } catch (error) {
      console.error("NutrientService.searchNutrientsByName error:", error);
      throw new Error(
        `Failed to search nutrients: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getNutrientsByParent(parentId: string | null): Promise<Nutrient[]> {
    try {
      return await this.nutrientRepository.findByParentId(parentId);
    } catch (error) {
      console.error("NutrientService.getNutrientsByParent error:", error);
      throw new Error(
        `Failed to get nutrients by parent: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getNutrientsCount(): Promise<number> {
    try {
      return await this.nutrientRepository.count();
    } catch (error) {
      console.error("NutrientService.getNutrientsCount error:", error);
      throw new Error(
        `Failed to get nutrients count: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
