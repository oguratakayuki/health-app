// src/services/userService.ts (新規作成を推奨)
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);

export class UserService {
  async createUser(email: string, name: string): Promise<User> {
    const now = new Date();
    const userData = {
          email: email,
          name: name,
          cognitoSub: null,
          createdAt: now, 
          updatedAt: now,
      };
      // 一度 'unknown' にアサートしてから 'Partial<User>' にアサート
      const newUser = userRepository.create(userData as unknown as Partial<User>);
      return userRepository.save(newUser);
  }
  /**
   * ログイン時にCognito Subを更新する
   */
  async updateCognitoSub(email: string, cognitoSub: string): Promise<User | null> {
      const user = await userRepository.findOne({ where: { email } });

      if (user && !user.cognitoSub) {
          user.cognitoSub = cognitoSub;
          user.updatedAt = new Date();
          return userRepository.save(user);
      }
      return user; // 既に設定されているか、ユーザーが見つからない場合はそのまま返す
  }

  async syncUserByCognitoSub(sub: string, email: string, name: string) {
    const repo = AppDataSource.getRepository(User);

    let user = await repo.findOne({ where: { cognitoSub: sub } });
    if (!user) {
      user = repo.create({ cognitoSub: sub, email, name });
      await repo.save(user);
      console.log(`Created new user ${email}`);
    } else {
      user.name = name;
      await repo.save(user);
    }

    return user;
  }
}

export const userService = new UserService();
