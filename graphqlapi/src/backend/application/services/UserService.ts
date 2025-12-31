import { IUserService } from "@/backend/domain/interfaces/IUserService";
import { IUserRepository } from "@/backend/domain/interfaces/IUserRepository";
import { User, CreateUserInput } from "@/backend/domain/entities/User";

export class UserService implements IUserService {
  private readonly userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    if (!userRepository) {
      throw new Error("UserRepository must be provided");
    }
    this.userRepository = userRepository;
  }

  async findByCognitoSub(cognitoSub: string): Promise<User | null> {
    return await this.userRepository.findByCognitoSub(cognitoSub);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async getUserById(id: bigint): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async createUser(email: string, name: string): Promise<User> {
    const now = new Date();
    const userData: CreateUserInput = {
      email,
      name,
      cognitoSub: "",
    };
    const user = await this.userRepository.create(userData);
    return user;
  }

  async getUsers(limit?: number): Promise<User[]> {
    // 実装が必要（UserResolverで使用）
    try {
      const users = await this.userRepository.findAll();
      return limit ? users.slice(0, limit) : users;
    } catch (error) {
      console.error(`Error in getUsers: ${error}`);
      throw new Error("ユーザー一覧の取得に失敗しました");
    }
  }

  async updateCognitoSub(
    email: string,
    cognitoSub: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    if (user && !user.cognitoSub) {
      const updatedUser = await this.userRepository.update(user.id, {
        cognitoSub,
      });
      return updatedUser;
    }
    return user;
  }

  async syncUserByCognitoSub(
    sub: string,
    email: string,
    name: string,
  ): Promise<User> {
    let user = await this.userRepository.findByCognitoSub(sub);
    if (!user) {
      const userData: CreateUserInput = {
        email,
        name,
        cognitoSub: sub,
      };
      user = await this.userRepository.create(userData);
    } else {
      user = await this.userRepository.update(user.id, { name });
    }

    return user;
  }
}
