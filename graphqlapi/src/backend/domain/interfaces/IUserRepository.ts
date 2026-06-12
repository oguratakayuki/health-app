import { User } from "@/backend/domain/entities/User";
import { CreateUserDto, UpdateUserDto } from "@/backend/application/dtos/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByCognitoSub(cognitoSub: string): Promise<User | null>;
  create(input: CreateUserDto): Promise<User>;
  update(id: string, input: UpdateUserDto): Promise<User>;
  save(user: User): Promise<User>;
  findById(id: bigint): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete?(id: string): Promise<boolean>;
}
