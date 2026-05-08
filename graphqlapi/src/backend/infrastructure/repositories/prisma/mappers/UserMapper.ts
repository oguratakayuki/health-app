import { User } from "@/backend/domain/entities/User";
import { User as PrismaUser } from "@prisma/client";

export class UserMapper {
  /**
   * PrismaのUserをUser型にマッピング
   */
  static mapToUser(prismaUser: PrismaUser): User {
    return {
      id: prismaUser.id.toString(),
      email: prismaUser.email,
      name: prismaUser.name,
      cognitoSub: prismaUser.cognitoSub,
      isAdmin: prismaUser.isAdmin,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }
}
