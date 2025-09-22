import { Resolver, Query } from "type-graphql";
import { Tag } from "../entities/Tag";
import { AppDataSource } from "../data-source";

@Resolver()
export class TagResolver {
  @Query(() => [Tag])
  async tags() {
    return AppDataSource.getRepository(Tag).find();
  }
}

