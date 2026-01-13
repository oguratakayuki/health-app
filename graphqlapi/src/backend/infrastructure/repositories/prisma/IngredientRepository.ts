import { IIngredientRepository } from "@/backend/domain/interfaces/IIngredientRepository";
import {
  Ingredient,
  IngredientWithRelations,
} from "@/backend/domain/entities/Ingredient";
import { RepositoryError } from "@/backend/domain/entities/Common";
import { PrismaClient } from "@prisma/client";

export class PrismaIngredientRepository implements IIngredientRepository {
  constructor(private prismaClient: PrismaClient) {
    if (!prismaClient) {
      throw new Error("PrismaClient is required");
    }
  }

  /**
   * 全ての材料を取得（関連情報を含む）
   */
  async findAll(): Promise<IngredientWithRelations[]> {
    try {
      const ingredients = await this.prismaClient.ingredient.findMany({
        include: {
          ingredientNutrients: {
            include: {
              nutrient: true,
            },
          },
          dishIngredients: {
            include: {
              dish: true,
            },
          },
        },
        orderBy: { id: "asc" },
      });
      console.log("HERE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

      return ingredients.map((ingredient) =>
        this.mapToIngredientWithRelations(ingredient),
      );
    } catch (error) {
      console.error("PrismaIngredientRepository.findAll error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * IDで材料を検索
   */
  async findById(id: bigint): Promise<IngredientWithRelations | null> {
    try {
      const ingredient = await this.prismaClient.ingredient.findUnique({
        where: { id },
        include: {
          ingredientNutrients: {
            include: {
              nutrient: true,
            },
          },
          dishIngredients: {
            include: {
              dish: true,
            },
          },
        },
      });

      if (!ingredient) return null;

      return this.mapToIngredientWithRelations(ingredient);
    } catch (error) {
      console.error("PrismaIngredientRepository.findById error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 材料を作成
   */
  async create(
    ingredientData: Omit<Ingredient, "id" | "createdAt" | "updatedAt">,
  ): Promise<Ingredient> {
    try {
      const ingredient = await this.prismaClient.ingredient.create({
        data: {
          name: ingredientData.name,
          remarks: ingredientData.remarks,
          originalName: ingredientData.originalName,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return this.mapToIngredient(ingredient);
    } catch (error) {
      console.error("PrismaIngredientRepository.create error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 材料を更新
   */
  async update(
    id: bigint,
    ingredientData: Partial<Ingredient>,
  ): Promise<Ingredient> {
    try {
      const ingredient = await this.prismaClient.ingredient.update({
        where: { id },
        data: {
          ...(ingredientData.name && { name: ingredientData.name }),
          ...(ingredientData.remarks && { remarks: ingredientData.remarks }),
          ...(ingredientData.originalName && {
            originalName: ingredientData.originalName,
          }),
          updatedAt: new Date(),
        },
      });

      return this.mapToIngredient(ingredient);
    } catch (error) {
      console.error("PrismaIngredientRepository.update error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 材料を削除
   */
  async delete(id: bigint): Promise<void> {
    try {
      await this.prismaClient.ingredient.delete({
        where: { id },
      });
    } catch (error) {
      console.error("PrismaIngredientRepository.delete error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 名前で材料を検索
   */
  async findByName(name: string): Promise<Ingredient[]> {
    try {
      const ingredients = await this.prismaClient.ingredient.findMany({
        where: {
          name: {
            contains: name,
          },
        },
        orderBy: { id: "asc" },
      });

      return ingredients.map((ingredient) => this.mapToIngredient(ingredient));
    } catch (error) {
      console.error("PrismaIngredientRepository.findByName error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 材料の総数を取得
   */
  async count(): Promise<number> {
    try {
      return await this.prismaClient.ingredient.count();
    } catch (error) {
      console.error("PrismaIngredientRepository.count error:", error);
      throw this.handleError(error);
    }
  }

  // ==================== プライベートメソッド ====================

  /**
   * PrismaのIngredientをIngredient型にマッピング
   */
  private mapToIngredient(prismaIngredient: any): Ingredient {
    return {
      id: prismaIngredient.id,
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
  private mapToIngredientWithRelations(
    prismaIngredient: any,
  ): IngredientWithRelations {
    const baseIngredient = this.mapToIngredient(prismaIngredient);
    return {
      ...baseIngredient,
      // ingredientNutrientsから栄養素情報を抽出
      nutrients: prismaIngredient.ingredientNutrients?.map(
        (inNutrient: any) => ({
          id: inNutrient.nutrient.id,
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
        id: di.dish.id,
        name: di.dish.name,
        createdAt: di.dish.createdAt,
        updatedAt: di.dish.updatedAt,
      })),
      ingredientNutrients: prismaIngredient.ingredientNutrients?.map(
        (inNutrient: any) => ({
          id: inNutrient.id,
          ingredientId: inNutrient.ingredientId,
          nutrientId: inNutrient.nutrientId,
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

  /**
   * エラーハンドリング
   */
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
