import {
  NutrientsIntakeStandard,
  NutrientsIntakeStandardWithRelations,
  Gender,
  NutrientUnit,
} from "@/backend/domain/entities/NutrientsIntakeStandard";
import { Prisma } from "@prisma/client";

type PrismaNutrientsIntakeStandard =
  Prisma.NutrientsIntakeStandardGetPayload<{}>;
type PrismaNutrientsIntakeStandardWithRelations =
  Prisma.NutrientsIntakeStandardGetPayload<{
    include: { nutrient: true };
  }>;

export class NutrientsIntakeStandardRepositoryMapper {
  /**
   * Railsの整数Enumを文字列に変換してマッピング
   */
  static mapToEntity(
    prismaData: PrismaNutrientsIntakeStandard,
  ): NutrientsIntakeStandard {
    console.log(prismaData.gender);
    return {
      id: prismaData.id.toString(), // bigintをstringに変換
      nutrientId: Number(prismaData.nutrientId),
      content: prismaData.content,
      gender: prismaData.gender as Gender,
      unit: prismaData.unit as NutrientUnit,
      ageFrom: prismaData.ageFrom.toNumber(),
      ageTo: prismaData.ageTo.toNumber(),
      createdAt: prismaData.createdAt,
      updatedAt: prismaData.updatedAt,
    };
  }

  static mapToEntityWithRelations(
    prismaData: PrismaNutrientsIntakeStandardWithRelations,
  ): NutrientsIntakeStandardWithRelations {
    return {
      ...this.mapToEntity(prismaData),
      nutrient: prismaData.nutrient
        ? {
            id: prismaData.nutrient.id.toString(),
            name: prismaData.nutrient.name,
            code: prismaData.nutrient.code,
          }
        : undefined,
    };
  }
}
