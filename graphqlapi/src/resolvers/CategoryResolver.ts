import { Resolver, Query } from "type-graphql";
import { Category } from "../entities/Category";
import { AppDataSource } from "../data-source";

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  async categories() {
    return AppDataSource.getRepository(Category).find();
  }
}

