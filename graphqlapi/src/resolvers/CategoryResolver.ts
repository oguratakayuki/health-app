import { Query, Resolver } from "type-graphql";
import { Category } from "../entities/Category";
import { AppDataSource, initializeDataSource } from "../data-source";

@Resolver(Category)
export class CategoryResolver {
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    await initializeDataSource();
    return AppDataSource.getRepository(Category).find();
  }
}
