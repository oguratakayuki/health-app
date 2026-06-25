// src/backend/infrastructure/mappers/MealPresentationMapper.ts
import { UpdateNutrientInput } from "@/backend/infrastructure/graphql/inputs/UpdateNutrientInput";

import { Nutrient as NutrientEntity } from "@/backend/domain/entities/Nutrient";
import { Nutrient as GraphQLNutrient } from "@/backend/infrastructure/graphql/types/Nutrient";
import { UpdateNutrientDto } from "@/backend/application/dtos/Nutrient";

export class NutrientPresentationMapper {
  // 【上り】更新用：Presentation（GraphQL入力） ➔ Application（UseCase DTO）
  static toServiceDto(input: UpdateNutrientInput): UpdateNutrientDto {
    return {
      name: input.name,
      code: input.code,
    };
  }

  // 【下り】Domain ➔ Presentation（GraphQL出力）
  static toGraphQLType(entity: NutrientEntity): GraphQLNutrient {
    return {
      id: entity.id.toString(),
      parentId: entity.parentId?.toString() ?? null,
      name: entity.name,
      code: entity.code,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
