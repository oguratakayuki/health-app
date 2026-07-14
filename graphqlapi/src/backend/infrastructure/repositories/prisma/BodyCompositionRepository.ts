import { PrismaClient } from "@prisma/client";
import { IBodyCompositionRepository } from "@/backend/domain/interfaces/IBodyCompositionRepository";
import { BodyComposition, EditBodyCompositionRepositoryInput } from "@/backend/domain/entities/BodyComposition";
import { BodyCompositionRepositoryMapper } from "@/backend/acl/domain_infrastructure/BodyCompositionRepositoryMapper";

export class BodyCompositionRepository implements IBodyCompositionRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUser(userId: string, limit?: number, offset?: number): Promise<BodyComposition[]> {
    const results = await this.prisma.bodyComposition.findMany({
      where: { userId: Number(userId) },
      orderBy: { measuredAt: "desc" },
      take: limit,
      skip: offset,
    });

    return results.map((item) => BodyCompositionRepositoryMapper.mapToDomain(item));
  }

  async findById(id: string): Promise<BodyComposition | null> {
    const result = await this.prisma.bodyComposition.findUnique({
      where: { id: Number(id) },
    });

    return result ? BodyCompositionRepositoryMapper.mapToDomain(result) : null;
  }

  async update(id: string, input: EditBodyCompositionRepositoryInput): Promise<BodyComposition | null> {
    const updated = await this.prisma.bodyComposition.update({
      where: { id: Number(id) },
      data: {
        measuredAt: input.measuredAt,
        weight: input.weight,
        bmi: input.bmi,
        bodyFatPercentage: input.bodyFatPercentage,
        bodyFatMass: input.bodyFatMass,
        subcutaneousFatPercentage: input.subcutaneousFatPercentage,
        visceralFatLevel: input.visceralFatLevel,
        skeletalMusclePercentage: input.skeletalMusclePercentage,
        skeletalMuscleMass: input.skeletalMuscleMass,
        ffmi: input.ffmi,
        boneMass: input.boneMass,
        basalMetabolism: input.basalMetabolism,
      },
    });

    return updated ? BodyCompositionRepositoryMapper.mapToDomain(updated) : null;
  }
}
