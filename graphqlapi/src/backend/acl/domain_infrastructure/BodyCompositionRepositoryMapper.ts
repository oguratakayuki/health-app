import { Prisma } from "@prisma/client";
import { BodyComposition } from "@/backend/domain/entities/BodyComposition";

export class BodyCompositionRepositoryMapper {
  /**
   * Prisma Model -> Domain Entity 変換
   */
  static mapToDomain(p: any): BodyComposition {
    return {
      id: p.id.toString(),
      userId: p.userId.toString(),
      weight: Number(p.weight),
      bmi: Number(p.bmi),
      bodyFatPercentage: Number(p.bodyFatPercentage),
      bodyFatMass: Number(p.bodyFatMass),
      skeletalMusclePercentage: Number(p.skeletalMusclePercentage),
      skeletalMuscleMass: Number(p.skeletalMuscleMass),
      subcutaneousFatPercentage: Number(p.subcutaneousFatPercentage),
      ffmi: Number(p.ffmi),
      boneMass: Number(p.boneMass),
      visceralFatLevel: p.visceralFatLevel,
      basalMetabolism: p.basalMetabolism,
      measuredAt: p.measuredAt,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }
}
