import { PrismaClient } from "@prisma/client";
import { IIngredientNutrientRepository } from "@/backend/domain/interfaces/IIngredientNutrientRepository";
import {
  IngredientNutrient,
  IngredientNutrientWithRelations,
  CreateIngredientNutrientInput,
} from "@/backend/domain/entities/IngredientNutrient";
import { RepositoryError } from "@/backend/domain/entities/Common";
import { IngredientNutrientRepositoryMapper } from "@/backend/acl/domain_infrastructure/IngredientNutrientRepositoryMapper";

export class IngredientNutrientRepository implements IIngredientNutrientRepository {
  constructor(private prismaClient: PrismaClient) {}

  async findByIngredientId(
    ingredientId: string,
  ): Promise<IngredientNutrientWithRelations[]> {
    const results = await this.prismaClient.ingredientNutrient.findMany({
      where: {
        ingredientId: BigInt(ingredientId),
      },
      include: {
        ingredient: true,
        nutrient: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return results.map((r) =>
      IngredientNutrientRepositoryMapper.mapToDomain(r),
    );
  }

  async findById(id: bigint): Promise<IngredientNutrientWithRelations | null> {
    const ingredientNutrient =
      await this.prismaClient.ingredientNutrient.findUnique({
        where: { id },
        include: {
          ingredient: true,
          nutrient: true,
        },
      });

    if (!ingredientNutrient) {
      return null;
    }

    return IngredientNutrientRepositoryMapper.mapToDomain(ingredientNutrient);
  }

  async findAll(limit?: number): Promise<IngredientNutrientWithRelations[]> {
    try {
      const results = await this.prismaClient.ingredientNutrient.findMany({
        take: limit,
        include: {
          ingredient: true,
          nutrient: true,
        },
        orderBy: {
          id: "asc",
        },
      });

      return results.map((item) =>
        IngredientNutrientRepositoryMapper.mapToDomain(item),
      );
    } catch (error) {
      console.error("Error in IngredientNutrientRepository.findAll:", error);
      throw error;
    }
  }

  async create(
    input: CreateIngredientNutrientInput,
  ): Promise<IngredientNutrientWithRelations> {
    try {
      const ingredientNutrient =
        await this.prismaClient.ingredientNutrient.create({
          data: {
            ingredientId: input.ingredientId,
            nutrientId: input.nutrientId,
            contentQuantity: input.contentQuantity,
            contentUnit: input.contentUnit,
            contentUnitPer: input.contentUnitPer,
            contentUnitPerUnit: input.contentUnitPerUnit,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          include: {
            ingredient: true,
            nutrient: true,
          },
        });

      return IngredientNutrientRepositoryMapper.mapToDomain(ingredientNutrient);
    } catch (error) {
      console.error("IngredientNutrientRepository.create error:", error);
      throw this.handleError(error);
    }
  }

  async update(
    id: bigint,
    data: Partial<IngredientNutrient>,
  ): Promise<IngredientNutrient> {
    throw new Error("Method not implemented.");
  }

  async delete(id: bigint): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findByIngredientIds(
    ingredientIds: bigint[],
  ): Promise<IngredientNutrientWithRelations[]> {
    const records = await this.prismaClient.ingredientNutrient.findMany({
      where: {
        ingredientId: {
          in: ingredientIds.map((id) => Number(id)),
        },
      },
      include: {
        ingredient: true,
        nutrient: true,
      },
    });

    return records.map((r) =>
      IngredientNutrientRepositoryMapper.mapToDomain(r),
    );
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
