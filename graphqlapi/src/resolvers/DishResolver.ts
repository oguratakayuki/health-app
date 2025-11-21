import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Dish } from "../entities/Dish";
import { Ingredient } from "../entities/Ingredient";
import { DishEntity } from "../entities/DishEntity";
import { AppDataSource, initializeDataSource } from "../data-source";

@Resolver(() => Dish)
export class DishResolver {
  @Query(() => [Dish])
  async dishes(): Promise<Dish[]> {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(DishEntity);
    const rows = await repo.find({
      relations: ["dishIngredients", "dishIngredients.ingredient", "ingredients"],
    });

    // DishEntity → GraphQL Dish にマッピング
    return rows.map(d => ({
      id: d.id,
      name: d.name,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      ingredients: d.ingredients?.map(i => ({ id: i.id, name: i.name })),
    })) as Dish[];
  }

  @Query(() => Dish, { nullable: true })
  async dish(@Arg("id") id: string): Promise<Dish | null> {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(DishEntity);
    const d = await repo.findOne({
      where: { id: Number(id) },
      relations: ["dishIngredients", "dishIngredients.ingredient", "ingredients"],
    });

    if (!d) return null;

    return {
      id: d.id,
      name: d.name,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      ingredients: d.ingredients?.map(i => ({ id: i.id, name: i.name })) as Ingredient[],
    };
  }

  @Mutation(() => Dish)
  async createDish(@Arg("name") name: string): Promise<Dish> {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(DishEntity);
    const now = new Date();

    const ent = repo.create({ name, createdAt: now, updatedAt: now });
    const saved = await repo.save(ent);

    return {
      id: saved.id,
      name: saved.name,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      ingredients: [],
    };
  }

  @Mutation(() => Dish)
  async updateDish(@Arg("id") id: string, @Arg("name") name: string): Promise<Dish> {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(DishEntity);

    const dish = await repo.findOne({ where: { id: Number(id) } });
    if (!dish) throw new Error("Dish not found");

    dish.name = name;
    dish.updatedAt = new Date();
    const saved = await repo.save(dish);

    return {
      id: saved.id,
      name: saved.name,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      ingredients: [],
    };
  }
}
