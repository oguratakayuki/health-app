import { IUserRepository } from "@/backend/domain/interfaces/IUserRepository";
import {
  User,
  CreateUserInput,
  UpdateUserInput,
} from "@/backend/domain/entities/User";
import { RepositoryError } from "@/backend/domain/entities/Common";
import { PrismaClient } from "@prisma/client";

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

      return this.mapToUser(user);
    } catch (error) {
      console.error("PrismaUserRepository.findByEmail error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * IDでユーザーを検索（必要に応じて追加）
   */
  async findById(id: BigInt): Promise<User | null> {
    try {
      const user = await this.prismaClient.user.findUnique({
        where: { id },
      });

      if (!user) return null;

      return this.mapToUser(user);
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

      return this.mapToUser(user);
    } catch (error) {
      console.error("PrismaUserRepository.findByCognitoSub error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * ユーザーを作成
   */
  async create(input: CreateUserInput): Promise<User> {
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

      return this.mapToUser(user);
    } catch (error) {
      console.error("PrismaUserRepository.create error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * ユーザーを更新
   */
  async update(id: string, input: UpdateUserInput): Promise<User> {
    try {
      const user = await this.prismaClient.user.update({
        where: { id: BigInt(id) },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.cognitoSub !== undefined && {
            cognitoSub: input.cognitoSub,
          }),
          ...(input.isAdmin !== undefined && { isAdmin: input.isAdmin }),
          updatedAt: new Date(),
        },
      });

      return this.mapToUser(user);
    } catch (error) {
      console.error("PrismaUserRepository.update error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * ユーザーを保存（更新と同等）
   */
  async save(user: User): Promise<User> {
    // saveメソッドはupdateと同等の実装
    const updateData: UpdateUserInput = {
      name: user.name,
      cognitoSub: user.cognitoSub,
      isAdmin: user.isAdmin,
    };

    return this.update(user.id, updateData);
  }

  /**
   * 全てのユーザーを取得（必要に応じて追加）
   */
  async findAll(): Promise<User[]> {
    try {
      const users = await this.prismaClient.user.findMany({
        orderBy: { id: "asc" },
      });

      return users.map((user) => this.mapToUser(user));
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

  // ==================== プライベートメソッド ====================

  /**
   * PrismaのUserをUser型にマッピング
   */
  private mapToUser(prismaUser: any): User {
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
