import { Resolver, Query } from "type-graphql";
import { AppDataSource, initializeDataSource } from "../data-source";
import { IngredientEntity } from "../entities/IngredientEntity";
import { Ingredient } from "../entities/Ingredient";

@Resolver()
export class IngredientResolver {
  @Query(() => [Ingredient])
  async ingredients(): Promise<Ingredient[]> {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(IngredientEntity);
    const rows = await repo.find({ relations: ["nutrients", "dishes"] });

    // GraphQL 用に手動マッピング
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      createdAt: r.createdAt as Date,
      updatedAt: r.updatedAt as Date,
      nutrients: r.nutrients?.map((n) => ({
        id: n.id as unknown as string,
        name: n.name,
        createdAt: n.createdAt as Date,
        updatedAt: n.updatedAt as Date,
        parentId: n.parentId,
      })),
      dishes: r.dishes?.map((d) => ({
        id: d.id,
        name: d.name,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
    }));
  }
}

