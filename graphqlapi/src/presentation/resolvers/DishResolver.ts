import { Query, Resolver, Arg, Mutation, Ctx } from 'type-graphql';

import { Dish } from '@/infrastructure/graphql/types/Dish';
import { DishWithIngredients } from '@/infrastructure/graphql/types/Dish';
import { CreateDishInput } from '@/infrastructure/graphql/inputs/prisma/CreateDishInput';
import { UpdateDishInput } from '@/infrastructure/graphql/inputs/prisma/UpdateDishInput';
import type { GraphQLContext } from '@/application/types/context';
import { DishService } from '@/application/services/DishService';

@Resolver()
export class DishResolver {
  /**
   * コンテキストからDishServiceを取得
   * コンテキストにサービスがない場合はエラーをスロー
   */
  private getDishService(ctx: GraphQLContext): DishService {
    if (!ctx.dishService) {
      throw new Error('DishService is not available in context');
    }
    return ctx.dishService;
  }

  @Query(() => Dish, { nullable: true, name: "prismaDish" })
  async dish(
    @Arg('id') id: string,
    @Ctx() ctx: GraphQLContext
  ): Promise<Dish | null> {
    try {
      const dishService = this.getDishService(ctx);
      const dish = await dishService.getDish(id);
      return dish as Dish;
    } catch (error) {
      console.error(`Error in prismaDish query: ${error}`);
      throw new Error('Failed to fetch dish');
    }
  }

  @Query(() => [Dish], { name: "prismaDishes" })
  async dishes(@Ctx() ctx: GraphQLContext): Promise<Dish[]> {
    try {
      const dishService = this.getDishService(ctx);
      return await dishService.getAllDishes() as Dish[];
    } catch (error) {
      console.error(`Error in prismaDishes query: ${error}`);
      throw new Error('Failed to fetch dishes');
    }
  }

  @Query(() => [DishWithIngredients], { name: "prismaDishesWithIngredients" })
  async dishesWithIngredients(@Ctx() ctx: GraphQLContext): Promise<DishWithIngredients[]> {
    try {
      const dishService = this.getDishService(ctx);
      return await dishService.getDishesWithIngredients() as DishWithIngredients[];
    } catch (error) {
      console.error(`Error in prismaDishesWithIngredients query: ${error}`);
      throw new Error('Failed to fetch dishes with ingredients');
    }
  }

  @Query(() => String, { name: "prismaDishesCount" })
  async dishesCount(@Ctx() ctx: GraphQLContext): Promise<string> {
    try {
      const dishService = this.getDishService(ctx);
      const count = await dishService.getDishesCount();
      return count.toString();
    } catch (error) {
      console.error(`Error in prismaDishesCount query: ${error}`);
      throw new Error('Failed to get dishes count');
    }
  }

  @Mutation(() => Dish, { name: "createDish" })
  async createDish(
    @Arg('input') input: CreateDishInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<Dish> {
    try {
      const dishService = this.getDishService(ctx);
      return await dishService.createDish(input) as Dish;
    } catch (error) {
      console.error(`Error in createDish mutation: ${error}`);
      throw new Error(`Failed to create dish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @Mutation(() => Dish, { name: "updateDish" })
  async updateDish(
    @Arg('id') id: string,
    @Arg('input') input: UpdateDishInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<Dish> {
    try {
      const dishService = this.getDishService(ctx);
      return await dishService.updateDish(id, input) as Dish;
    } catch (error) {
      console.error(`Error in updateDish mutation: ${error}`);
      throw new Error(`Failed to update dish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @Mutation(() => Boolean, { name: "deleteDish" })
  async deleteDish(
    @Arg('id') id: string,
    @Ctx() ctx: GraphQLContext
  ): Promise<boolean> {
    try {
      const dishService = this.getDishService(ctx);
      return await dishService.deleteDish(id);
    } catch (error) {
      console.error(`Error in deleteDish mutation: ${error}`);
      throw new Error(`Failed to delete dish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
