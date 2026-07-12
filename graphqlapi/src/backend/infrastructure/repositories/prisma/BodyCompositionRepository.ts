import { PrismaClient } from "@prisma/client";
import { IBodyCompositionRepository } from "@/backend/domain/interfaces/IBodyCompositionRepository";
import { BodyComposition } from "@/backend/domain/entities/BodyComposition";
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
}
