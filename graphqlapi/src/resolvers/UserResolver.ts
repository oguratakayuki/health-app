import { Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { AppDataSource, initializeDataSource } from "../data-source";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    await initializeDataSource();
    return AppDataSource.getRepository(User).find();
  }
}
