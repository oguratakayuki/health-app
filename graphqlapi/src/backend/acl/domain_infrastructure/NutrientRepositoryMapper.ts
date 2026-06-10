import { Nutrient } from "@/backend/domain/entities/Nutrient";
import { Nutrient as PrismaNutrient } from "@prisma/client";

export class NutrientRepositoryMapper {
  static mapToDomain(prismaNutrient: PrismaNutrient): Nutrient {
    return {
      id: Number(prismaNutrient.id),
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
