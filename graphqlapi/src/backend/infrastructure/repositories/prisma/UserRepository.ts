import { IUserRepository } from "@/backend/domain/interfaces/IUserRepository";
import {
  User,
  CreateUserRepositoryInput,
} from "@/backend/domain/entities/User";
import { RepositoryError } from "@/backend/domain/entities/Common";
import { PrismaClient } from "@prisma/client";
import { UserRepositoryMapper } from "@/backend/acl/domain_infrastructure/UserRepositoryMapper";

export class UserRepository implements IUserRepository {
  constructor(private prismaClient: PrismaClient) {
    if (!prismaClient) {
      throw new Error("PrismaClient is required");
    }
  }
  /**
   * メールアドレスでユーザーを検索
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prismaClient.user.findUnique({
        where: { email },
      });

      if (!user) return null;

      return UserRepositoryMapper.mapToUser(user);
    } catch (error) {
      console.error("PrismaUserRepository.findByEmail error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * IDでユーザーを検索（必要に応じて追加）
   */
  async findById(id: bigint): Promise<User | null> {
    try {
      const user = await this.prismaClient.user.findUnique({
        where: { id },
      });

      if (!user) return null;

      return UserRepositoryMapper.mapToUser(user);
    } catch (error) {
      console.error("PrismaUserRepository.findById error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Cognito Subでユーザーを検索
   */
  async findByCognitoSub(cognitoSub: string): Promise<User | null> {
    try {
      const user = await this.prismaClient.user.findUnique({
        where: { cognitoSub },
      });

      if (!user) return null;

      return UserRepositoryMapper.mapToUser(user);
    } catch (error) {
      console.error("PrismaUserRepository.findByCognitoSub error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * ユーザーを作成
   */
  async create(input: CreateUserRepositoryInput): Promise<User> {
    try {
      const user = await this.prismaClient.user.create({
        data: {
          email: input.email,
          name: input.name,
          cognitoSub: input.cognitoSub,
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return UserRepositoryMapper.mapToUser(user);
    } catch (error) {
      console.error("PrismaUserRepository.create error:", error);
      throw this.handleError(error);
    }
  }

  async updateName(id: string, name: string): Promise<User> {
    try {
      const user = await this.prismaClient.user.update({
        where: { id: BigInt(id) },
        data: {
          name,
          updatedAt: new Date(),
        },
      });

      return UserRepositoryMapper.mapToUser(user);
    } catch (error) {
      console.error("PrismaUserRepository.updateName error:", error);
      throw this.handleError(error);
    }
  }

  async updateCognitoSub(id: string, cognitoSub: string): Promise<User> {
    try {
      const user = await this.prismaClient.user.update({
        where: { id: BigInt(id) },
        data: {
          cognitoSub,
          updatedAt: new Date(),
        },
      });

      return UserRepositoryMapper.mapToUser(user);
    } catch (error) {
      console.error("PrismaUserRepository.updateCognitoSub error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * 全てのユーザーを取得（必要に応じて追加）
   */
  async findAll(): Promise<User[]> {
    try {
      const users = await this.prismaClient.user.findMany({
        orderBy: { id: "asc" },
      });

      return users.map((user) => UserRepositoryMapper.mapToUser(user));
    } catch (error) {
      console.error("PrismaUserRepository.findAll error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * ユーザーを削除（必要に応じて追加）
   */
  async delete(id: string): Promise<boolean> {
    try {
      await this.prismaClient.user.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      console.error("PrismaUserRepository.delete error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * エラーハンドリング
   */
  private handleError(error: any): RepositoryError {
    const prismaError = error as { code?: string; message: string };
    if (prismaError.code === "P2025") {
      return {
        code: "NOT_FOUND",
        message: "Record not found",
      };
    }
    if (prismaError.code === "P2002") {
      return {
        code: "DUPLICATE",
        message: "Duplicate record found",
      };
    }

    return {
      code: "UNKNOWN_ERROR",
      message: prismaError.message || "Unknown database error",
      details: error,
    };
  }
}
