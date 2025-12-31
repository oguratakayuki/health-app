// src/repositories/prisma/NutrientRepository.ts
import { INutrientRepository } from "@/backend/domain/interfaces/INutrientRepository";
import {
  Nutrient,
  CreateNutrientInput,
  UpdateNutrientInput,
} from "@/backend/domain/entities/Nutrient";
import { RepositoryError } from "@/backend/domain/entities/Common";
import { PrismaClient } from "@prisma/client";

export class PrismaNutrientRepository implements INutrientRepository {
  constructor(private prismaClient: PrismaClient) {
    if (!prismaClient) {
      throw new Error("PrismaClient is required");
    }
  }

  async findById(id: string): Promise<Nutrient | null> {
    try {
      const nutrient = await this.prismaClient.nutrient.findUnique({
        where: { id: BigInt(id) },
      });

      if (!nutrient) return null;

      return this.mapToNutrient(nutrient);
    } catch (error) {
      console.error("PrismaNutrientRepository.findById error:", error);
      throw this.handleError(error);
    }
  }

  async findAll(): Promise<Nutrient[]> {
    try {
      const nutrients = await this.prismaClient.nutrient.findMany({
        orderBy: { id: "asc" },
      });

      return nutrients.map((nutrient) => this.mapToNutrient(nutrient));
    } catch (error) {
      console.error("PrismaNutrientRepository.findAll error:", error);
      throw this.handleError(error);
    }
  }

  async create(input: CreateNutrientInput): Promise<Nutrient> {
    try {
      const nutrient = await this.prismaClient.nutrient.create({
        data: {
          name: input.name,
          parentId: input.parentId ? BigInt(input.parentId) : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return this.mapToNutrient(nutrient);
    } catch (error) {
      console.error("PrismaNutrientRepository.create error:", error);
      throw this.handleError(error);
    }
  }

  async update(id: string, input: UpdateNutrientInput): Promise<Nutrient> {
    try {
      const nutrient = await this.prismaClient.nutrient.update({
        where: { id: BigInt(id) },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.parentId !== undefined && {
            parentId: input.parentId ? BigInt(input.parentId) : null,
          }),
          updatedAt: new Date(),
        },
      });

      return this.mapToNutrient(nutrient);
    } catch (error) {
      console.error("PrismaNutrientRepository.update error:", error);
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prismaClient.nutrient.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      console.error("PrismaNutrientRepository.delete error:", error);
      throw this.handleError(error);
    }
  }

  async findByName(name: string): Promise<Nutrient[]> {
    try {
      const nutrients = await this.prismaClient.nutrient.findMany({
        where: {
          name: {
            contains: name,
          },
        },
        orderBy: { id: "asc" },
      });

      return nutrients.map((nutrient) => this.mapToNutrient(nutrient));
    } catch (error) {
      console.error("PrismaNutrientRepository.findByName error:", error);
      throw this.handleError(error);
    }
  }

  async findByParentId(parentId: string | null): Promise<Nutrient[]> {
    try {
      const nutrients = await this.prismaClient.nutrient.findMany({
        where: {
          parentId: parentId ? BigInt(parentId) : null,
        },
        orderBy: { id: "asc" },
      });

      return nutrients.map((nutrient) => this.mapToNutrient(nutrient));
    } catch (error) {
      console.error("PrismaNutrientRepository.findByParentId error:", error);
      throw this.handleError(error);
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prismaClient.nutrient.count();
    } catch (error) {
      console.error("PrismaNutrientRepository.count error:", error);
      throw this.handleError(error);
    }
  }

  // ==================== プライベートメソッド ====================

  private mapToNutrient(prismaNutrient: any): Nutrient {
    return {
      id: prismaNutrient.id.toString(),
      name: prismaNutrient.name,
      parentId: prismaNutrient.parentId
        ? prismaNutrient.parentId.toString()
        : null,
      createdAt: prismaNutrient.createdAt,
      updatedAt: prismaNutrient.updatedAt,
    };
  }

  private handleError(error: any): RepositoryError {
    const prismaError = error as { code?: string; message: string };
    if (prismaError.code === "P2025") {
      return {
        code: "NOT_FOUND",
        message: "Record not found",
      };
    }
    if (prismaError.code === "P2002") {
      return {
        code: "DUPLICATE",
        message: "Duplicate record found",
      };
    }

    return {
      code: "UNKNOWN_ERROR",
      message: prismaError.message || "Unknown database error",
      details: error,
    };
  }
}
