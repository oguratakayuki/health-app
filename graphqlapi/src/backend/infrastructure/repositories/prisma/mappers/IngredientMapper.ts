import {
  Ingredient,
  IngredientWithRelations,
} from "@/backend/domain/entities/Ingredient";
import { Ingredient as PrismaIngredient } from "@prisma/client";

// Define a type for Prisma Ingredient with necessary relations
type PrismaIngredientWithRelations = PrismaIngredient & {
  ingredientNutrients?: {
    nutrient: {
      id: bigint;
      name: string | null;
      parentId: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
    id: bigint;
    ingredientId: bigint;
    nutrientId: bigint;
    contentQuantity: number;
    contentUnit: string;
    contentUnitPer: number | null;
    contentUnitPerUnit: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  dishIngredients?: {
    dish: {
      id: bigint;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }[];
};

export class IngredientMapper {
  /**
   * PrismaのIngredientをIngredient型にマッピング
   */
  static mapToIngredient(prismaIngredient: PrismaIngredient): Ingredient {
    return {
      id: prismaIngredient.id.toString(),
      name: prismaIngredient.name,
      remarks: prismaIngredient.remarks,
      originalName: prismaIngredient.originalName,
      createdAt: prismaIngredient.createdAt,
      updatedAt: prismaIngredient.updatedAt,
    };
  }

  /**
   * PrismaのIngredientをIngredientWithRelations型にマッピング
   */
  static mapToIngredientWithRelations(
    prismaIngredient: PrismaIngredientWithRelations,
  ): IngredientWithRelations {
    const baseIngredient = IngredientMapper.mapToIngredient(prismaIngredient);
    return {
      ...baseIngredient,
      // ingredientNutrientsから栄養素情報を抽出
      nutrients: prismaIngredient.ingredientNutrients?.map(
        (inNutrient: any) => ({
          id: inNutrient.nutrient.id.toString(),
          name: inNutrient.nutrient.name,
          parentId: inNutrient.nutrient.parentId,
          createdAt: inNutrient.nutrient.createdAt,
          updatedAt: inNutrient.nutrient.updatedAt,
          // 栄養素情報に関連する追加フィールド
          contentQuantity: inNutrient.contentQuantity,
          contentUnit: inNutrient.contentUnit,
          contentUnitPer: inNutrient.contentUnitPer,
          contentUnitPerUnit: inNutrient.contentUnitPerUnit,
        }),
      ),
      dishes: prismaIngredient.dishIngredients?.map((di: any) => ({
        id: di.dish.id.toString(),
        name: di.dish.name,
        createdAt: di.dish.createdAt,
        updatedAt: di.dish.updatedAt,
      })),
      ingredientNutrients: prismaIngredient.ingredientNutrients?.map(
        (inNutrient: any) => ({
          id: inNutrient.id.toString(),
          ingredientId: inNutrient.ingredientId.toString(),
          nutrientId: inNutrient.nutrientId.toString(),
          contentQuantity: inNutrient.contentQuantity,
          contentUnit: inNutrient.contentUnit,
          contentUnitPer: inNutrient.contentUnitPer,
          contentUnitPerUnit: inNutrient.contentUnitPerUnit,
          createdAt: inNutrient.createdAt,
          updatedAt: inNutrient.updatedAt,
        }),
      ),
    };
  }
}