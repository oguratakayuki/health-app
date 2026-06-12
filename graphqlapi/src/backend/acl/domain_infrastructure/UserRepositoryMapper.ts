import { User } from "@/backend/domain/entities/User";
import { User as PrismaUser } from "@prisma/client";

export class UserRepositoryMapper {
  /**
   * PrismaのUserをUser型にマッピング
   */
  static mapToUser(prismaUser: PrismaUser): User {
    return {
      id: prismaUser.id.toString(),
      email: prismaUser.email,
      name: prismaUser.name,
      height: prismaUser.height !== null ? Number(prismaUser.height) : null,
      birthday: prismaUser.birthday,
      cognitoSub: prismaUser.cognitoSub,
      isAdmin: prismaUser.isAdmin,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }
}
