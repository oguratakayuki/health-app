import {
  NutrientsIntakeStandard,
  NutrientsIntakeStandardWithRelations,
  GENDER_LABELS,
  NUTRIENT_UNIT_LABELS,
} from "@/backend/domain/entities/NutrientsIntakeStandard";
import { Prisma } from "@prisma/client";

type PrismaNutrientsIntakeStandard =
  Prisma.NutrientsIntakeStandardGetPayload<{}>;
type PrismaNutrientsIntakeStandardWithRelations =
  Prisma.NutrientsIntakeStandardGetPayload<{
    include: { nutrient: true };
  }>;

export class NutrientsIntakeStandardMapper {
  /**
   * Railsの整数Enumを文字列に変換してマッピング
   */
  static mapToEntity(
    prismaData: PrismaNutrientsIntakeStandard,
  ): NutrientsIntakeStandard {
    return {
      id: prismaData.id.toString(), // bigintをstringに変換
      nutrientId: prismaData.nutrientId.toString(),
      content: prismaData.content,
      gender:
        prismaData.gender !== null ? GENDER_LABELS[prismaData.gender] : null,
      unit:
        prismaData.unit !== null ? NUTRIENT_UNIT_LABELS[prismaData.unit] : null,
      ageFrom: prismaData.ageFrom ? prismaData.ageFrom.toNumber() : null,
      ageTo: prismaData.ageTo ? prismaData.ageTo.toNumber() : null,
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
          }
        : undefined,
    };
  }
}
