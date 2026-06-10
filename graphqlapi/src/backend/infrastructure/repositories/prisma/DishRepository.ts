import { IDishRepository } from "@/backend/domain/interfaces/IDishRepository";
import {
  Dish,
  DishWithIngredients,
  CreateDishInput,
  UpdateDishInput,
} from "@/backend/domain/entities/Dish";
import { RepositoryError } from "@/backend/domain/entities/Common";
import { PrismaClient, Prisma } from "@prisma/client";
import { DishRepositoryMapper } from "@/backend/acl/domain_infrastructure/DishRepositoryMapper";

export class PrismaDishRepository implements IDishRepository {
  constructor(private prismaClient: PrismaClient) {
    if (!prismaClient) {
      throw new Error("PrismaClient is required");
    }
  }

  /**
   * IDで料理を検索
   */
  async findById(id: string): Promise<DishWithIngredients | null> {
    try {
      const dish = await this.prismaClient.dish.findUnique({
        where: { id: BigInt(id) },
        include: {
          dishIngredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });

      if (!dish) return null;

      return DishRepositoryMapper.mapToDishWithIngredients(dish as any);
    } catch (error) {
      console.error("PrismaDishRepository.findById error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 全ての料理を取得
   */
  async findAll(): Promise<Dish[]> {
    try {
      const dishes = await this.prismaClient.dish.findMany({
        orderBy: { id: "asc" },
      });

      return dishes.map((dish) => DishRepositoryMapper.mapToDish(dish));
    } catch (error) {
      console.error("PrismaDishRepository.findAll error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 料理を作成 (トランザクション内)
   */
  async createWithTx(
    tx: Prisma.TransactionClient,
    input: CreateDishInput,
  ): Promise<Dish> {
    try {
      const dish = await tx.dish.create({
        data: {
          name: input.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return DishRepositoryMapper.mapToDish(dish);
    } catch (error) {
      console.error("PrismaDishRepository.createWithTx error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 料理を作成
   */
  async create(input: CreateDishInput): Promise<Dish> {
    try {
      const dish = await this.prismaClient.dish.create({
        data: {
          name: input.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return DishRepositoryMapper.mapToDish(dish);
    } catch (error) {
      console.error("PrismaDishRepository.create error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 料理を更新
   */
  async update(id: string, input: UpdateDishInput): Promise<Dish> {
    try {
      const dish = await this.prismaClient.dish.update({
        where: { id: BigInt(id) },
        data: {
          ...(input.name && { name: input.name }),
          updatedAt: new Date(), // 明示的に更新日時を設定
        },
      });

      return DishRepositoryMapper.mapToDish(dish);
    } catch (error) {
      console.error("PrismaDishRepository.update error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 料理を削除
   */
  async delete(id: string): Promise<boolean> {
    try {
      await this.prismaClient.dish.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      console.error("PrismaDishRepository.delete error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 名前で料理を検索
   */
  async findByName(name: string): Promise<Dish[]> {
    try {
      const dishes = await this.prismaClient.dish.findMany({
        where: {
          name: {
            contains: name,
            // mode: 'insensitive' はMySQLではサポートされていない場合がある
          },
        },
        orderBy: { id: "asc" },
      });

      return dishes.map((dish) => DishRepositoryMapper.mapToDish(dish));
    } catch (error) {
      console.error("PrismaDishRepository.findByName error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 料理の総数を取得
   */
  async count(): Promise<number> {
    try {
      return await this.prismaClient.dish.count();
    } catch (error) {
      console.error("PrismaDishRepository.count error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 材料情報を含む料理を取得
   */
  async findWithIngredients(id: string): Promise<DishWithIngredients | null> {
    // findByIdと同じ実装なので、そちらを呼び出す
    return this.findById(id);
  }

  /**
   * 全ての料理を材料情報を含めて取得
   */
  async findAllWithIngredients(): Promise<DishWithIngredients[]> {
    try {
      const dishes = await this.prismaClient.dish.findMany({
        include: {
          dishIngredients: {
            include: {
              ingredient: true,
            },
          },
        },
        orderBy: { id: "asc" },
      });

      return dishes.map((dish) =>
        DishRepositoryMapper.mapToDishWithIngredients(dish as any),
      );
    } catch (error) {
      console.error(
        "PrismaDishRepository.findAllWithIngredients error:",
        error,
      );
      throw this.handleError(error);
    }
  }

  // ==================== プライベートメソッド ====================

  /**
   * エラーハンドリング
   */
  private handleError(error: any): RepositoryError {
    // エラーコードの確認
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
