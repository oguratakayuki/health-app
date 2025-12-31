import {
  User,
  CreateUserInput,
  UpdateUserInput,
} from "@/backend/domain/entities/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByCognitoSub(cognitoSub: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  update(id: string, input: UpdateUserInput): Promise<User>;
  save(user: User): Promise<User>;
  findById(id: bigint): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete?(id: string): Promise<boolean>;
}
