import { Resolver, Query } from 'type-graphql'
import { Ingredient } from '../entities/Ingredient'
import { AppDataSource, initializeDataSource } from "../data-source";

@Resolver(Ingredient)
export class IngredientResolver {
  private ingredientRepository = AppDataSource.getRepository(Ingredient)

  @Query(() => [Ingredient])
  async ingredients(): Promise<Ingredient[]> {
    await initializeDataSource();
    return this.ingredientRepository.find({
      relations: ['nutrients'], // nutrients を一緒に取得
    })
  }
}
