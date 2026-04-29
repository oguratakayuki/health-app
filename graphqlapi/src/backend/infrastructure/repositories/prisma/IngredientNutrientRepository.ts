import { PrismaClient } from "@prisma/client";
import { IIngredientNutrientRepository } from "@/backend/domain/interfaces/IIngredientNutrientRepository";
import { IngredientNutrient } from "@/backend/domain/entities/IngredientNutrient";
import { Nutrient } from "@/backend/domain/entities/Nutrient";
import { IngredientNutrientWithRelations } from "@/backend/domain/entities/IngredientNutrient";
import { NutrientCode } from "@/backend/domain/types/NutrientCode";

function mapNutrientCode(code: string): NutrientCode {
  switch (code) {
    case "energy_kcal":
      return NutrientCode.Energy;

    case "protein_g":
      return NutrientCode.Protein;

    case "fat_g":
      return NutrientCode.Fat;

    case "carbohydrate_g":
      return NutrientCode.Carbohydrate;

    case "fiber_g":
      return NutrientCode.Fiber;

    case "vitamin_a_ug":
      return NutrientCode.VitaminA;

    case "vitamin_c_mg":
      return NutrientCode.VitaminC;

    case "vitamin_d_ug":
      return NutrientCode.VitaminD;

    case "calcium_mg":
      return NutrientCode.Calcium;

    case "iron_mg":
      return NutrientCode.Iron;

    case "zinc_mg":
      return NutrientCode.Zinc;

    case "potassium_mg":
      return NutrientCode.Potassium;

    default:
      throw new Error(`Unknown nutrient code: ${code}`);
  }
}

export class IngredientNutrientRepository implements IIngredientNutrientRepository {
  constructor(private prismaClient: PrismaClient) {}

  async findByIngredientId(
    ingredientId: string,
  ): Promise<IngredientNutrient[]> {
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

    return results.map((r) => ({
      id: BigInt(r.id),
      ingredientId: BigInt(r.ingredientId),
      nutrientId: BigInt(r.nutrientId),
      contentQuantity: r.contentQuantity,
      contentUnit: r.contentUnit,
      contentUnitPer: r.contentUnitPer,
      contentUnitPerUnit: r.contentUnitPerUnit,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      ingredient: {
        id: r.ingredient.id.toString(),
        name: r.ingredient.name,
        remarks: r.ingredient.remarks,
        originalName: r.ingredient.originalName,
        createdAt: r.ingredient.createdAt,
        updatedAt: r.ingredient.updatedAt,
      },
      nutrient:
        r.contentQuantity === null
          ? Nutrient.uncalculated(mapNutrientCode(r.nutrient.code))
          : Nutrient.of(mapNutrientCode(r.nutrient.code), r.contentQuantity),
    }));
  }

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

  async findByIngredientIds(
    ingredientIds: bigint[],
  ): Promise<IngredientNutrient[]> {
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

    return records.map((r) => ({
      id: BigInt(r.id),
      ingredientId: BigInt(r.ingredientId),
      nutrientId: BigInt(r.nutrientId),
      contentQuantity: r.contentQuantity,
      contentUnit: r.contentUnit,
      contentUnitPer: r.contentUnitPer,
      contentUnitPerUnit: r.contentUnitPerUnit,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      ingredient: {
        id: r.ingredient.id.toString(),
        name: r.ingredient.name,
        remarks: r.ingredient.remarks,
        originalName: r.ingredient.originalName,
        createdAt: r.ingredient.createdAt,
        updatedAt: r.ingredient.updatedAt,
      },
      nutrient:
        r.contentQuantity === null
          ? Nutrient.uncalculated(mapNutrientCode(r.nutrient.name))
          : Nutrient.of(mapNutrientCode(r.nutrient.name), r.contentQuantity),
    }));
  }
}
