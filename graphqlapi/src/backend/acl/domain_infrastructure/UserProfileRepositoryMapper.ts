import { Prisma, UserProfile as PrismaUserProfile } from "@prisma/client";
import { UserProfile } from "@/backend/domain/entities/UserProfile";
import { UserProfileRepositoryInput } from "@/backend/domain/entities/UserProfile";

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

  static mapToPrismaUpdate(input: Partial<UserProfileRepositoryInput>): Prisma.UserProfileUpdateInput {
    const updateData: Prisma.UserProfileUpdateInput = {};
    if (input.gender !== undefined) updateData.gender = input.gender;
    if (input.height !== undefined) updateData.height = input.height;
    if (input.birthday !== undefined) updateData.birthday = input.birthday;

    return updateData;
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
