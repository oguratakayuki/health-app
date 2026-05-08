import { IngredientNutrientWithRelations } from "@/backend/domain/entities/IngredientNutrient";

import { Prisma } from "@prisma/client";

type PrismaItemWithRelations = Prisma.IngredientNutrientGetPayload<{
  include: {
    ingredient: true;
    nutrient: true;
  };
}>;

export class IngredientNutrientMapper {
  static mapToDomain(
    prismaItem: PrismaItemWithRelations,
  ): IngredientNutrientWithRelations {
    return {
      id: prismaItem.id.toString(),
      ingredientId: prismaItem.ingredientId.toString(),
      nutrientId: prismaItem.nutrientId.toString(),
      contentQuantity: prismaItem.contentQuantity,
      contentUnit: prismaItem.contentUnit,
      contentUnitPer: prismaItem.contentUnitPer ?? null,
      contentUnitPerUnit: prismaItem.contentUnitPerUnit,
      createdAt: prismaItem.createdAt,
      updatedAt: prismaItem.updatedAt,

      ingredient: {
        id: prismaItem.ingredient.id.toString(),
        name: prismaItem.ingredient.name,
        originalName: prismaItem.ingredient.originalName,
        remarks: prismaItem.ingredient.remarks,
        createdAt: prismaItem.ingredient.createdAt,
        updatedAt: prismaItem.ingredient.updatedAt,
      },

      nutrient: {
        id: prismaItem.nutrient.id.toString(),
        name: prismaItem.nutrient.name,
        code: prismaItem.nutrient.code,
        parentId: prismaItem.nutrient.parentId,
        createdAt: prismaItem.nutrient.createdAt,
        updatedAt: prismaItem.nutrient.updatedAt,
      },
    };
  }
}
