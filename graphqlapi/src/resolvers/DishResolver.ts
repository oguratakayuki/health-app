import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Dish } from "../entities/Dish";
import { AppDataSource, initializeDataSource } from "../data-source";

@Resolver(Dish)
export class DishResolver {
  @Query(() => [Dish])
  async dishes(): Promise<Dish[]> {
    await initializeDataSource();
    return AppDataSource.getRepository(Dish).find();
  }

  @Query(() => Dish, { nullable: true })
  async dish(@Arg("id") id: string): Promise<Dish | null> {
    await initializeDataSource();
    return AppDataSource.getRepository(Dish).findOne({ where: { id: id as unknown as string } });
  }

  @Mutation(() => Dish)
  async createDish(@Arg("name") name: string): Promise<Dish> {
    await initializeDataSource();
    const now = new Date();
    const dish = AppDataSource.getRepository(Dish).create({ 
      name,
      createdAt: now,
      updatedAt: now,
    });
    return AppDataSource.getRepository(Dish).save(dish);
  }

  @Mutation(() => Dish)
  async updateDish(@Arg("id") id: string, @Arg("name") name: string): Promise<Dish> {
    await initializeDataSource();
    const now = new Date();
    const repo = AppDataSource.getRepository(Dish);
    const dish = await repo.findOne({ where: { id: id as unknown as string } });
    if (!dish) throw new Error("Dish not found");
    dish.name = name;
    dish.updatedAt = now
    return repo.save(dish);
  }

  @Mutation(() => Boolean)
  async deleteDish(@Arg("id") id: string): Promise<boolean> {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(Dish);
    const result = await repo.delete({ id: id as unknown as string });
    return result.affected ? true : false;
  }
}

