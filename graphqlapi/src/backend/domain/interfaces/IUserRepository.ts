import {
  User,
  CreateUserRepositoryInput,
  UpdateUserRepositoryInput,
} from "@/backend/domain/entities/User";
import {} from "@/backend/application/dtos/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByCognitoSub(cognitoSub: string): Promise<User | null>;
  create(input: CreateUserRepositoryInput): Promise<User>;
  updateName(id: string, name: string): Promise<User>;
  updateCognitoSub(id: string, name: string): Promise<User>;
  findById(id: bigint): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete?(id: string): Promise<boolean>;
}
