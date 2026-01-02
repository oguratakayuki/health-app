// graphqlapi/src/backend/infrastructure/repositories/prisma/NutrientsIntakeStandardRepository.ts

import { PrismaClient } from "@prisma/client";
import {
  INutrientsIntakeStandardRepository,
  CreateNutrientsIntakeStandardInput,
  UpdateNutrientsIntakeStandardInput,
} from "@/backend/domain/interfaces/INutrientsIntakeStandardRepository";
import {
  NutrientsIntakeStandard,
  NutrientsIntakeStandardWithRelations,
  NUTRIENT_UNIT_LABELS,
  GENDER_LABELS,
} from "@/backend/domain/entities/NutrientsIntakeStandard";
import { RepositoryError } from "@/backend/domain/entities/Common";

export class NutrientsIntakeStandardRepository implements INutrientsIntakeStandardRepository {
  constructor(private prismaClient: PrismaClient) {
    if (!prismaClient) {
      throw new Error("PrismaClient is required");
    }
  }

  async findAll(): Promise<NutrientsIntakeStandardWithRelations[]> {
    try {
      const records = await this.prismaClient.nutrientsIntakeStandard.findMany({
        include: { nutrient: true },
        orderBy: { id: "asc" },
      });

      return records.map((record) => this.mapToEntityWithRelations(record));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * 栄養素情報を含めて全ての摂取基準を取得
   */
  async findAllWithRelations(): Promise<
    NutrientsIntakeStandardWithRelations[]
  > {
    try {
      const records = await this.prismaClient.nutrientsIntakeStandard.findMany({
        include: {
          nutrient: true, // Nutrientモデルをジョインして取得
        },
        orderBy: [{ nutrientId: "asc" }, { gender: "asc" }, { ageFrom: "asc" }],
      });

      return records.map((record) => this.mapToEntityWithRelations(record));
    } catch (error) {
      console.error(
        "PrismaNutrientsIntakeStandardRepository.findAllWithRelations error:",
        error,
      );
      throw this.handleError(error);
    }
  }

  /**
   * 摂取基準の新規作成
   */
  async create(
    data: CreateNutrientsIntakeStandardInput,
  ): Promise<NutrientsIntakeStandard> {
    try {
      // 文字列からRails形式のIndex(整数)に変換
      const unitIndex = data.unit
        ? NUTRIENT_UNIT_LABELS.indexOf(data.unit as any)
        : null;
      const genderIndex = data.gender
        ? GENDER_LABELS.indexOf(data.gender as any)
        : null;

      // indexOf が -1 (見つからない) の場合は undefined/null などのハンドリングが必要
      const record = await this.prismaClient.nutrientsIntakeStandard.create({
        data: {
          nutrientId: data.nutrientId,
          content: data.content,
          unit: unitIndex !== -1 ? unitIndex : null,
          gender: genderIndex !== -1 ? genderIndex : null,
          ageFrom: data.ageFrom,
          ageTo: data.ageTo,
          // created_at, updated_at は Prisma の @default(now()) / @updatedAt で自動処理
        },
      });

      return this.mapToEntity(record);
    } catch (error) {
      console.error(
        "PrismaNutrientsIntakeStandardRepository.create error:",
        error,
      );
      throw this.handleError(error);
    }
  }

  /**
   * IDで検索
   */
  async findById(
    id: string,
  ): Promise<NutrientsIntakeStandardWithRelations | null> {
    try {
      const record = await this.prismaClient.nutrientsIntakeStandard.findUnique(
        {
          where: { id: BigInt(id) },
          include: { nutrient: true },
        },
      );

      if (!record) return null;
      return this.mapToEntityWithRelations(record);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * 特定の栄養素IDに紐づく全ての摂取基準を取得
   */
  async findByNutrientId(
    nutrientId: number,
  ): Promise<NutrientsIntakeStandard[]> {
    try {
      const records = await this.prismaClient.nutrientsIntakeStandard.findMany({
        where: {
          nutrientId: BigInt(nutrientId),
        },
        orderBy: [{ gender: "asc" }, { ageFrom: "asc" }],
      });

      return records.map((record) => this.mapToEntity(record));
    } catch (error) {
      console.error(
        "PrismaNutrientsIntakeStandardRepository.findByNutrientId error:",
        error,
      );
      throw this.handleError(error);
    }
  }
  /**
   * 摂取基準の更新
   */
  async update(
    id: string,
    data: UpdateNutrientsIntakeStandardInput,
  ): Promise<NutrientsIntakeStandard> {
    try {
      // 更新データがある場合のみIndex変換を行う
      const unitIndex =
        data.unit !== undefined
          ? NUTRIENT_UNIT_LABELS.indexOf(data.unit as any)
          : undefined;
      const genderIndex =
        data.gender !== undefined
          ? GENDER_LABELS.indexOf(data.gender as any)
          : undefined;

      const record = await this.prismaClient.nutrientsIntakeStandard.update({
        where: { id: BigInt(id) },
        data: {
          ...(data.nutrientId !== undefined && {
            nutrientId: BigInt(data.nutrientId),
          }),
          ...(data.content !== undefined && { content: data.content }),
          ...(unitIndex !== undefined && {
            unit: unitIndex !== -1 ? unitIndex : null,
          }),
          ...(genderIndex !== undefined && {
            gender: genderIndex !== -1 ? genderIndex : null,
          }),
          ...(data.ageFrom !== undefined && { ageFrom: data.ageFrom }),
          ...(data.ageTo !== undefined && { ageTo: data.ageTo }),
        },
      });

      return this.mapToEntity(record);
    } catch (error) {
      console.error(
        "PrismaNutrientsIntakeStandardRepository.update error:",
        error,
      );
      throw this.handleError(error);
    }
  }

  /**
   * 摂取基準の削除
   */
  async delete(id: string): Promise<boolean> {
    try {
      await this.prismaClient.nutrientsIntakeStandard.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      console.error(
        "PrismaNutrientsIntakeStandardRepository.delete error:",
        error,
      );
      // レコードが存在しない場合のエラーなどは handleError で処理
      try {
        throw this.handleError(error);
      } catch (e) {
        return false;
      }
    }
  }

  /**
   * Railsの整数Enumを文字列に変換してマッピング
   */
  private mapToEntity(prismaData: any): NutrientsIntakeStandard {
    return {
      id: prismaData.id.toString(), // bigintをstringに変換
      nutrientId: Number(prismaData.nutrientId),
      content: prismaData.content,
      // 数値(index)をラベルに変換 (Railsのenum挙動の再現)
      unit:
        prismaData.unit !== null ? NUTRIENT_UNIT_LABELS[prismaData.unit] : null,
      gender:
        prismaData.gender !== null ? GENDER_LABELS[prismaData.gender] : null,
      ageFrom: prismaData.ageFrom ? prismaData.ageFrom.toNumber() : null,
      ageTo: prismaData.ageTo ? prismaData.ageTo.toNumber() : null,
      createdAt: prismaData.created_at,
      updatedAt: prismaData.updated_at,
    };
  }

  private mapToEntityWithRelations(
    prismaData: any,
  ): NutrientsIntakeStandardWithRelations {
    return {
      ...this.mapToEntity(prismaData),
      nutrient: prismaData.nutrient
        ? {
            id: prismaData.nutrient.id,
            name: prismaData.nutrient.name,
          }
        : undefined,
    };
  }

  private handleError(error: any): RepositoryError {
    // 既存のハンドルロジックを流用
    return {
      code: "UNKNOWN_ERROR",
      message: error.message || "Database error",
      details: error,
    };
  }
}
