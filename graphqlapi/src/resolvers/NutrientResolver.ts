import { Resolver, Query } from "type-graphql";
import { Nutrient } from "../entities/Nutrient";
import { AppDataSource } from "../data-source";

@Resolver()
export class NutrientResolver {
  @Query(() => [Nutrient])
  async nutrients() {
    const repo = AppDataSource.getRepository(Nutrient);
    return repo.find();
  }
}
