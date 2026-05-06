import { Nutrient } from "@/backend/domain/entities/Nutrient";
import { Nutrient as PrismaNutrient } from "@prisma/client";

export class NutrientMapper {
  static mapToDomain(prismaNutrient: PrismaNutrient): Nutrient {
    return {
      id: prismaNutrient.id.toString(),
      name: prismaNutrient.name,
      code: prismaNutrient.code,
      parentId: prismaNutrient.parentId
        ? prismaNutrient.parentId.toString()
        : null,
      createdAt: prismaNutrient.createdAt,
      updatedAt: prismaNutrient.updatedAt,
    };
  }
}
