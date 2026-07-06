import { PrismaClient } from "@prisma/client";
import { IUserProfileRepository } from "@/backend/domain/interfaces/IUserProfileRepository";
import { UserProfile } from "@/backend/domain/entities/UserProfile";
import { UserProfileRepositoryMapper } from "@/backend/acl/domain_infrastructure/UserProfileRepositoryMapper";

export class UserProfileRepository implements IUserProfileRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<UserProfile | null> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { id },
    });
    return profile ? UserProfileRepositoryMapper.mapToDomain(profile) : null;
  }

  async findByUserId(userId: number): Promise<UserProfile | null> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    return profile ? UserProfileRepositoryMapper.mapToDomain(profile) : null;
  }

  async save(profile: UserProfile): Promise<UserProfile> {
    const data = UserProfileRepositoryMapper.mapToPrisma(profile);
    
    const saved = await this.prisma.userProfile.upsert({
      where: { id: profile.id },
      update: data,
      create: {
        ...data,
      },
    });
    return UserProfileRepositoryMapper.mapToDomain(saved);
  }

  async update(id: number, input: Partial<UserProfileRepositoryInput>): Promise<UserProfile | null> {
    const prismaData = UserProfileRepositoryMapper.mapToPrismaUpdate(input);
    if (Object.keys(prismaData).length === 0) return this.findById(id);

    try {
      const updated = await this.prisma.userProfile.update({
        where: { id },
        data: prismaData,
      });
      return UserProfileRepositoryMapper.mapToDomain(updated);
    } catch (error) {
      return null;
    }
  }
}
