import { User  } from '@/domain/entities/User';

export interface IUserService {
  // getUsers(limit: number): Promise<User[]>;
  createUser(email: string, name: string): Promise<User>;
  getUserById(id: bigint): Promise<User | null>;
  updateCognitoSub(email: string, cognitoSub: string): Promise<User | null>;
  syncUserByCognitoSub(sub: string, email: string, name: string): Promise<User>;
  syncUserByCognitoSub(cognitoSub: string, email: string, name: string): Promise<User>;
  getUsers(limit?: number): Promise<User[]>;
}
