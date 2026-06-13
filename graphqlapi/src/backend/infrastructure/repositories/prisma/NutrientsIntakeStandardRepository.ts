import { PrismaClient } from "@prisma/client";
import { INutrientsIntakeStandardRepository } from "@/backend/domain/interfaces/INutrientsIntakeStandardRepository";
import {
  NutrientsIntakeStandard,
  NutrientsIntakeStandardWithRelations,
  CreateNutrientsIntakeStandardRepositoryInput,
  UpdateNutrientsIntakeStandardRepositoryInput,
  FindAllWithFiltersOptionsRepositoryInput,
} from "@/backend/domain/entities/NutrientsIntakeStandard";

import { RepositoryError } from "@/backend/domain/entities/Common";
import { NutrientsIntakeStandardRepositoryMapper } from "@backend/acl/domain_infrastructure/NutrientsIntakeStandardRepositoryMapper";
import { Gender } from "@/backend/domain/types/Gender";

export class NutrientsIntakeStandardRepository implements INutrientsIntakeStandardRepository {
  constructor(private prismaClient: PrismaClient) {
    if (!prismaClient) {
      throw new Error("PrismaClient is required");
    }
  }

  async findAllWithFilters(
    options: FindAllWithFiltersOptionsRepositoryInput,
  ): Promise<NutrientsIntakeStandard[]> {
    const where: any = {};
    // 性別フィルター
    if (options.gender) {
      where.gender = options.gender;
    }
    // 年齢フィルター（指定年齢を含む基準を検索）
    if (options.age !== undefined) {
      where.OR = [
        // 年齢範囲がない（全年代）
        { ageFrom: null, ageTo: null },
        // 下限のみ（指定年齢以上）
        { ageFrom: { lte: options.age }, ageTo: null },
        // 上限のみ（指定年齢以下）
        { ageFrom: null, ageTo: { gte: options.age } },
        // 範囲内（指定年齢が範囲内）
        {
          ageFrom: { lte: options.age },
          ageTo: { gte: options.age },
        },
      ];
    }
    console.log("Generated WHERE clause:", JSON.stringify(where, null, 2));
    const records = await this.prismaClient.nutrientsIntakeStandard.findMany({
      where,
      include: { nutrient: true },
      orderBy: { id: "asc" },
    });
    return records.map((record) =>
      NutrientsIntakeStandardRepositoryMapper.mapToEntityWithRelations(
        record as any,
      ),
    );
  }

  async findAll(): Promise<NutrientsIntakeStandardWithRelations[]> {
    try {
      const records = await this.prismaClient.nutrientsIntakeStandard.findMany({
        include: { nutrient: true },
        orderBy: { id: "asc" },
      });

      return records.map((record) =>
        NutrientsIntakeStandardRepositoryMapper.mapToEntityWithRelations(
          record as any,
        ),
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findByGenderAndAge(
    gender: Gender,
    age: number,
  ): Promise<NutrientsIntakeStandardWithRelations[]> {
    const records = await this.prismaClient.nutrientsIntakeStandard.findMany({
      where: {
        gender: gender,
        ageFrom: { lte: age },
        ageTo: { gte: age },
      },
      include: {
        nutrient: true,
      },
    });
    return records.map((record) =>
      NutrientsIntakeStandardRepositoryMapper.mapToEntityWithRelations(
        record as any,
      ),
    );
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

      return records.map((record) =>
        NutrientsIntakeStandardRepositoryMapper.mapToEntityWithRelations(
          record as any,
        ),
      );
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
    data: CreateNutrientsIntakeStandardRepositoryInput,
  ): Promise<NutrientsIntakeStandard> {
    try {
      const record = await this.prismaClient.nutrientsIntakeStandard.create({
        data: {
          nutrient: {
            connect: { id: BigInt(data.nutrientId) },
          },
          content: data.content,
          unit: data.unit,
          gender: data.gender,
          ageFrom: data.ageFrom,
          ageTo: data.ageTo,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return NutrientsIntakeStandardRepositoryMapper.mapToEntity(record);
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
      return NutrientsIntakeStandardRepositoryMapper.mapToEntityWithRelations(
        record as any,
      );
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

      return records.map((record) =>
        NutrientsIntakeStandardRepositoryMapper.mapToEntity(record),
      );
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
    data: UpdateNutrientsIntakeStandardRepositoryInput,
  ): Promise<NutrientsIntakeStandard> {
    try {
      // 更新データがある場合のみIndex変換を行う
      const record = await this.prismaClient.nutrientsIntakeStandard.update({
        where: { id: BigInt(id) },
        data: {
          nutrientId: BigInt(data.nutrientId),
          ...(data.content !== undefined && { content: data.content }),
          unit: data.unit,
          gender: data.gender,
          ageFrom: data.ageFrom,
          ageTo: data.ageTo,
        },
      });

      return NutrientsIntakeStandardRepositoryMapper.mapToEntity(record);
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

  private handleError(error: any): RepositoryError {
    // 既存のハンドルロジックを流用
    return {
      code: "UNKNOWN_ERROR",
      message: error.message || "Database error",
      details: error,
    };
  }
}
