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
}

export const userService = new UserService();
