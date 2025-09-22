import { Resolver, Query } from 'type-graphql'
import { Ingredient } from '../entities/Ingredient'
import { AppDataSource } from '../data-source'

@Resolver(Ingredient)
export class IngredientResolver {
  private ingredientRepository = AppDataSource.getRepository(Ingredient)

  @Query(() => [Ingredient])
  async ingredients(): Promise<Ingredient[]> {
    return this.ingredientRepository.find({
      relations: ['nutrients'], // nutrients を一緒に取得
    })
  }
}
