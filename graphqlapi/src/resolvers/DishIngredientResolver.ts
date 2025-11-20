import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { DishIngredient } from "../entities/DishIngredient";
import { AppDataSource, initializeDataSource } from "../data-source";

@Resolver(() => DishIngredient)
export class DishIngredientResolver {
  @Query(() => [DishIngredient])
  async dishIngredients() {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(DishIngredient);
    return repo.find({
      relations: ["dish", "ingredient"], // リレーションを取得
    });
  }

  @Query(() => DishIngredient, { nullable: true })
  async dishIngredient(@Arg("id", () => Int) id: string) {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(DishIngredient);
    return repo.findOne({
      where: { id },
      relations: ["dish", "ingredient"],
    });
  }

  @Mutation(() => DishIngredient)
  async createDishIngredient(
    @Arg("dishId", () => Int) dishId: number,
    @Arg("ingredientId", () => Int) ingredientId: number,
    @Arg("contentQuantity") contentQuantity: number,
    @Arg("contentUnit") contentUnit: string
  ) {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(DishIngredient);

    const now = new Date();

    const dishIngredient = repo.create({
      dish: { id: dishId } as any, // 関連先の Dish エンティティを部分的に指定
      ingredient: { id: ingredientId } as any, // 関連先の Ingredient エンティティを部分的に指定
      contentQuantity,
      contentUnit,
      createdAt: now,
      updatedAt: now,
    });

    return repo.save(dishIngredient);
  }

  @Mutation(() => DishIngredient)
  async updateDishIngredient(
    @Arg("id", () => Int) id: string,
    @Arg("contentQuantity") contentQuantity: number,
    @Arg("contentUnit") contentUnit: string
  ) {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(DishIngredient);

    const dishIngredient = await repo.findOne({ where: { id } });
    if (!dishIngredient) throw new Error("DishIngredient not found");

    dishIngredient.contentQuantity = contentQuantity;
    dishIngredient.contentUnit = contentUnit;
    dishIngredient.updatedAt = new Date();

    return repo.save(dishIngredient);
  }

  @Mutation(() => Boolean)
  async deleteDishIngredient(@Arg("id", () => Int) id: string) {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(DishIngredient);
    const result = await repo.delete({ id });
    return result.affected ? true : false;
  }
}
