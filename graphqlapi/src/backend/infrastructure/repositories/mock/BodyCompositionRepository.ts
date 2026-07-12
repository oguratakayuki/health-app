import { IBodyCompositionRepository } from "@/backend/domain/interfaces/IBodyCompositionRepository";
import { BodyComposition } from "@/backend/domain/entities/BodyComposition";

export class BodyCompositionRepository implements IBodyCompositionRepository {
  async findByUser(userId: string, limit?: number, offset?: number): Promise<BodyComposition[]> {
    // Mockデータの返却
    return [
      {
        id: "1",
        userId: userId,
        weight: 70.5,
        bmi: 22.1,
        bodyFatPercentage: 15.5,
        bodyFatMass: 5.4,
        skeletalMusclePercentage: 45.2,
        skeletalMuscleMass: 31.8,
        subcutaneousFatPercentage: 12.0,
        ffmi: 21.5,
        boneMass: 3.2,
        visceralFatLevel: 8,
        basalMetabolism: 1600,
        measuredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        userId: userId,
        weight: 71.0,
        bmi: 22.3,
        bodyFatPercentage: 15.8,
        bodyFatMass: 5.6,
        skeletalMusclePercentage: 44.8,
        skeletalMuscleMass: 31.5,
        subcutaneousFatPercentage: 12.2,
        ffmi: 21.3,
        boneMass: 3.2,
        visceralFatLevel: 8,
        basalMetabolism: 1610,
        measuredAt: new Date(Date.now() - 86400000), // 昨日
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async findById(id: string): Promise<BodyComposition | null> {
    return {
      id: id,
      userId: "user-123",
      weight: 70.5,
      bmi: 22.1,
      bodyFatPercentage: 15.5,
      bodyFatMass: 5.4,
      skeletalMusclePercentage: 45.2,
      skeletalMuscleMass: 31.8,
      subcutaneousFatPercentage: 12.0,
      ffmi: 21.5,
      boneMass: 3.2,
      visceralFatLevel: 8,
      basalMetabolism: 1600,
      measuredAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
