import { Prisma, UserProfile as PrismaUserProfile } from "@prisma/client";
import { UserProfile } from "@/backend/domain/entities/UserProfile";

export class UserProfileRepositoryMapper {
  static mapToDomain(p: PrismaUserProfile): UserProfile {
    return {
      id: Number(p.id),
      userId: Number(p.userId),
      gender: p.gender,
      height: Number(p.height),
      birthday: p.birthday,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }

  static mapToPrisma(profile: UserProfile): Prisma.UserProfileCreateInput | Prisma.UserProfileUpdateInput {
    return {
      userId: profile.userId,
      gender: profile.gender,
      height: profile.height,
      birthday: profile.birthday,
    };
  }
}
