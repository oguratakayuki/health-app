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
        // upsert時にIDを明示的に指定したい場合は、Prismaのモデル定義に依存するが、
        // 通常はuserIdでユニークなのでそこをキーにするか、既存IDがあれば更新とする。
      },
    });
    return UserProfileRepositoryMapper.mapToDomain(saved);
  }
}
