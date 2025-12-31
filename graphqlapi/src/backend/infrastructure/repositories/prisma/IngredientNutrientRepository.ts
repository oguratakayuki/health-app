import { PrismaClient } from "@prisma/client";
import { IIngredientNutrientRepository } from "@/backend/domain/interfaces/IIngredientNutrientRepository";
import { IngredientNutrient } from "@/backend/domain/entities/IngredientNutrient";
import { IngredientNutrientWithRelations } from "@/backend/domain/entities/IngredientNutrient";

export class IngredientNutrientRepository implements IIngredientNutrientRepository {
  constructor(private prismaClient: PrismaClient) {}

  async findById(id: bigint): Promise<IngredientNutrient | null> {
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

    return this.mapToDomain(ingredientNutrient);
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

      return results.map((item) => this.mapToDomain(item));
    } catch (error) {
      console.error("Error in IngredientNutrientRepository.findAll:", error);
      throw error;
    }
  }

  async create(data: Partial<IngredientNutrient>): Promise<IngredientNutrient> {
    throw new Error("Method not implemented.");
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
  // src/infrastructure/repositories/prisma/IngredientNutrientRepository.ts
  private mapToDomain(prismaItem: any): IngredientNutrientWithRelations {
    const result: IngredientNutrientWithRelations = {
      id: prismaItem.id.toString(),
      ingredientId: prismaItem.ingredientId,
      nutrientId: prismaItem.nutrientId,
      contentQuantity: prismaItem.contentQuantity,
      contentUnit: prismaItem.contentUnit,
      contentUnitPer: prismaItem.contentUnitPer?.toString(),
      contentUnitPerUnit: prismaItem.contentUnitPerUnit,
      createdAt: prismaItem.createdAt,
      updatedAt: prismaItem.updatedAt,
    };

    // ingredientが存在する場合のみ追加（null安全）
    if (prismaItem.ingredient && prismaItem.ingredient.id) {
      result.ingredient = {
        id: prismaItem.ingredient.id.toString(),
        name: prismaItem.ingredient.name,
        originalName: prismaItem.ingredient.originalName,
        remarks: prismaItem.ingredient.remarks,
        createdAt: prismaItem.ingredient.createdAt,
        updatedAt: prismaItem.ingredient.updatedAt,
      };
    } else {
      console.warn(
        `IngredientNutrient ${prismaItem.id}: ingredient is null or missing id`,
      );
    }

    // nutrientが存在する場合のみ追加（null安全）
    if (prismaItem.nutrient && prismaItem.nutrient.id) {
      result.nutrient = {
        id: prismaItem.nutrient.id.toString(),
        name: prismaItem.nutrient.name,
        parentId: prismaItem.nutrient.parentId,
        createdAt: prismaItem.nutrient.createdAt,
        updatedAt: prismaItem.nutrient.updatedAt,
      };
    } else {
      console.warn(
        `IngredientNutrient ${prismaItem.id}: nutrient is null or missing id`,
      );
    }

    return result;
  }
}
