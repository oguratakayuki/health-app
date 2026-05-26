// MealResolver.ts
import { Query, Resolver, Arg, Mutation, Ctx } from "type-graphql";

import {
  Meal,
  MealWithDishes,
} from "@/backend/infrastructure/graphql/types/Meal";
import { CreateMealWithDishesInput } from "@/backend/infrastructure/graphql/inputs/prisma/CreateMealWithDishesInput";
import { UpdateMealInput } from "@/backend/infrastructure/graphql/inputs/prisma/UpdateMealInput";
import type { GraphQLContext } from "@/backend/application/types/context";
import { MealService } from "@/backend/application/services/MealService";
import { Authorized } from "@/backend/application/auth/decorators";

@Resolver()
export class MealResolver {
  /**
   * コンテキストからMealServiceを取得
   * コンテキストにサービスがない場合はエラーをスロー
   */
  private getMealService(ctx: GraphQLContext): MealService {
    if (!ctx.mealService) {
      throw new Error("MealService is not available in context");
    }
    return ctx.mealService;
  }

  @Query(() => Meal, { nullable: true, name: "meal" })
  @Authorized()
  async meal(
    @Arg("id") id: string,
    @Ctx() ctx: GraphQLContext,
  ): Promise<Meal | null> {
    try {
      const mealService = this.getMealService(ctx);
      const meal = await mealService.getMeal(id);
      return meal as Meal;
    } catch (error) {
      console.error(`Error in meal query: ${error}`);
      throw new Error("Failed to fetch meal");
    }
  }

  @Query(() => [MealWithDishes], { name: "meals" })
  @Authorized()
  async meals(
    @Ctx() ctx: GraphQLContext,
    @Arg("from") from: string,
    @Arg("to") to: string,
  ): Promise<MealWithDishes[]> {
    try {
      const mealService = this.getMealService(ctx);
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        throw new Error("Invalid date format provided for from or to");
      }

      return (await mealService.getAllMealsWithDishes(
        ctx.user.id,
        fromDate,
        toDate,
      )) as MealWithDishes[];
    } catch (error) {
      console.error(`Error in meals query: ${error}`);
      throw new Error("Failed to fetch meals");
    }
  }

  @Query(() => MealWithDishes, { nullable: true, name: "mealWithDishes" })
  @Authorized()
  async mealWithDishes(
    @Arg("id") id: string,
    @Ctx() ctx: GraphQLContext,
  ): Promise<MealWithDishes | null> {
    try {
      const mealService = this.getMealService(ctx);
      const meal = await mealService.getMealWithDishes(parseInt(id));
      return meal as MealWithDishes;
    } catch (error) {
      console.error(`Error in mealWithDishes query: ${error}`);
      throw new Error("Failed to fetch meal with dishes");
    }
  }

  @Query(() => [MealWithDishes], { name: "mealsWithDishes" })
  @Authorized()
  async mealsWithDishes(
    @Ctx() ctx: GraphQLContext,
    @Arg("from") from: string,
    @Arg("to") to: string,
  ): Promise<MealWithDishes[]> {
    try {
      const mealService = this.getMealService(ctx);
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        throw new Error("Invalid date format provided for from or to");
      }

      return (await mealService.getAllMealsWithDishes(
        ctx.user.id,
        fromDate,
        toDate,
      )) as MealWithDishes[];
    } catch (error) {
      console.error(`Error in mealsWithDishes query: ${error}`);
      throw new Error("Failed to fetch meals with dishes");
    }
  }

  @Query(() => String, { name: "mealsCount" })
  @Authorized()
  async mealsCount(@Ctx() ctx: GraphQLContext): Promise<string> {
    try {
      const mealService = this.getMealService(ctx);
      const count = await mealService.getMealsCount();
      return count.toString();
    } catch (error) {
      console.error(`Error in mealsCount query: ${error}`);
      throw new Error("Failed to get meals count");
    }
  }

  @Mutation(() => Meal, { name: "createMealWithDishes" })
  @Authorized()
  async createMealWithDishes(
    @Arg("input") input: CreateMealWithDishesInput,
    @Ctx() ctx: GraphQLContext,
  ): Promise<Meal> {
    try {
      const mealService = this.getMealService(ctx);
      return (await mealService.createMealWithDishes(input)) as Meal;
    } catch (error) {
      console.error(`Error in createMealWithDishes mutation: ${error}`);
      throw new Error(
        `Failed to create meal with dishes: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  @Mutation(() => Meal, { name: "updateMeal" })
  @Authorized()
  async updateMeal(
    @Arg("id") id: string,
    @Arg("input") input: UpdateMealInput,
    @Ctx() ctx: GraphQLContext,
  ): Promise<Meal> {
    try {
      const mealService = this.getMealService(ctx);
      return (await mealService.updateMeal(id, input)) as Meal;
    } catch (error) {
      console.error(`Error in updateMeal mutation: ${error}`);
      throw new Error(
        `Failed to update meal: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  @Mutation(() => Boolean, { name: "deleteMeal" })
  @Authorized()
  async deleteMeal(
    @Arg("id") id: string,
    @Ctx() ctx: GraphQLContext,
  ): Promise<boolean> {
    try {
      const mealService = this.getMealService(ctx);
      return await mealService.deleteMeal(id);
    } catch (error) {
      console.error(`Error in deleteMeal mutation: ${error}`);
      throw new Error(
        `Failed to delete meal: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
