import { Resolver, Query } from "type-graphql";
import { Nutrients } from "../entities/Nutrients";
import { AppDataSource } from "../data-source";

@Resolver()
export class NutrientResolver {
  @Query(() => [Nutrients])
  async nutrients() {
    const repo = AppDataSource.getRepository(Nutrients);
    return repo.find();
  }
}
