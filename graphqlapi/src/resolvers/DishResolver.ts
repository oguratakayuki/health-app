import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Dish } from "../entities/Dish";
import { AppDataSource, initializeDataSource } from "../data-source";

@Resolver(() => Dish)
export class DishResolver {
  @Query(() => [Dish])
  async dishes() {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(Dish);
    return repo.find({
      relations: ["dishIngredients", "dishIngredients.ingredient", "ingredients"],
    });
  }

  @Query(() => Dish, { nullable: true })
  async dish(@Arg("id") id: string) {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(Dish);

    return repo.findOne({
      where: { id },
      relations: ["dishIngredients", "dishIngredients.ingredient", "ingredients"],
    });
  }

  @Mutation(() => Dish)
  async createDish(@Arg("name") name: string) {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(Dish);

    const now = new Date();

    const dish = repo.create({
      name,
      createdAt: now,
      updatedAt: now,
    });

    return repo.save(dish);
  }

  @Mutation(() => Dish)
  async updateDish(
    @Arg("id") id: string,
    @Arg("name") name: string
  ) {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(Dish);

    const dish = await repo.findOne({ where: { id } });
    if (!dish) throw new Error("Dish not found");

    dish.name = name;
    dish.updatedAt = new Date();

    return repo.save(dish);
  }
}
