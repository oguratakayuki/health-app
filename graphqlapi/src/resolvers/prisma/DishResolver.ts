import { Query, Resolver, Arg, Mutation, ObjectType, Field } from 'type-graphql';
import { ServiceFactory } from '../../services/adapters/index';
import { PrismaDish, PrismaDishWithIngredients } from '../../graphql/types/prisma/PrismaDish';
import { CreateDishInput } from '../../graphql/inputs/prisma/CreateDishInput';
import { UpdateDishInput } from '../../graphql/inputs/prisma/UpdateDishInput';

@Resolver()
export class PrismaDishResolver {
  private dishService = ServiceFactory.createDishService();

  // クエリ名にプレフィックスを付ける
  @Query(() => PrismaDish, { nullable: true, name: "prismaDish" })
  async dish(@Arg('id') id: string): Promise<PrismaDish | null> {
    try {
      const dish = await this.dishService.getDish(id);
      return dish as PrismaDish;
    } catch (error) {
      console.error(`Error in prismaDish query: ${error}`);
      throw new Error('Failed to fetch dish');
    }
  }

  @Query(() => [PrismaDish], { name: "prismaDishes" })
  async dishes(): Promise<PrismaDish[]> {
    try {
      return await this.dishService.getAllDishes() as PrismaDish[];
    } catch (error) {
      console.error(`Error in prismaDishes query: ${error}`);
      throw new Error('Failed to fetch dishes');
    }
  }

  @Query(() => [PrismaDishWithIngredients], { name: "prismaDishesWithIngredients" })
  async dishesWithIngredients(): Promise<PrismaDishWithIngredients[]> {
    try {
      return await this.dishService.getDishesWithIngredients() as PrismaDishWithIngredients[];
    } catch (error) {
      console.error(`Error in prismaDishesWithIngredients query: ${error}`);
      throw new Error('Failed to fetch dishes with ingredients');
    }
  }

  @Query(() => String, { name: "prismaDishesCount" })
  async dishesCount(): Promise<string> {
    try {
      const count = await this.dishService.getDishesCount();
      return count.toString();
    } catch (error) {
      console.error(`Error in prismaDishesCount query: ${error}`);
      throw new Error('Failed to get dishes count');
    }
  }

  @Mutation(() => PrismaDish, { name: "createPrismaDish" })
  async createDish(@Arg('input') input: CreateDishInput): Promise<PrismaDish> {
    try {
      return await this.dishService.createDish(input) as PrismaDish;
    } catch (error) {
      console.error(`Error in createPrismaDish mutation: ${error}`);
      throw new Error(`Failed to create dish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @Mutation(() => PrismaDish, { name: "updatePrismaDish" })
  async updateDish(
    @Arg('id') id: string,
    @Arg('input') input: UpdateDishInput
  ): Promise<PrismaDish> {
    try {
      return await this.dishService.updateDish(id, input) as PrismaDish;
    } catch (error) {
      console.error(`Error in updatePrismaDish mutation: ${error}`);
      throw new Error(`Failed to update dish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @Mutation(() => Boolean, { name: "deletePrismaDish" })
  async deleteDish(@Arg('id') id: string): Promise<boolean> {
    try {
      return await this.dishService.deleteDish(id);
    } catch (error) {
      console.error(`Error in deletePrismaDish mutation: ${error}`);
      throw new Error(`Failed to delete dish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
