// src/presentation/resolvers/prisma/NutrientResolver.ts
import { Query, Resolver, Arg, Mutation, ObjectType, Field, Ctx } from 'type-graphql';
import type { GraphQLContext } from '@/application/types/context';
import type { NutrientService } from '@/application/services/NutrientService';
import { Nutrient } from '@/infrastructure/graphql/types/Nutrient';
import { CreateNutrientInput } from '@/infrastructure/graphql/inputs/prisma/CreateNutrientInput';
import { UpdateNutrientInput } from '@/infrastructure/graphql/inputs/prisma/UpdateNutrientInput';

@ObjectType()
class NutrientsResponse {
  @Field(() => [Nutrient])
  nutrients!: Nutrient[];

  @Field()
  total!: number;
}

@Resolver(() => Nutrient)
export class NutrientResolver {
  /**
   * コンテキストからNutrientServiceを取得
   * コンテキストにサービスがない場合はエラーをスロー
   */
  private getNutrientService(@Ctx() ctx: GraphQLContext): NutrientService {
    if (!ctx.nutrientService) {
      throw new Error('NutrientService is not available in context');
    }
    return ctx.nutrientService;
  }

  @Query(() => Nutrient, { nullable: true })
  async prismaNutrient(
    @Arg('id') id: string,
    @Ctx() ctx: GraphQLContext
  ): Promise<Nutrient | null> {
    try {
      const nutrientService = this.getNutrientService(ctx);
      const nutrient = await nutrientService.getNutrient(id);
      return nutrient as Nutrient;
    } catch (error) {
      console.error(`Error in prismaNutrient query: ${error}`);
      throw new Error('Failed to fetch nutrient');
    }
  }

  @Query(() => [Nutrient])
  async prismaNutrients(@Ctx() ctx: GraphQLContext): Promise<Nutrient[]> {
    try {
      const nutrientService = this.getNutrientService(ctx);
      return await nutrientService.getAllNutrients() as Nutrient[];
    } catch (error) {
      console.error(`Error in prismaNutrients query: ${error}`);
      throw new Error('Failed to fetch nutrients');
    }
  }

  @Query(() => NutrientsResponse)
  async searchPrismaNutrients(
    @Ctx() ctx: GraphQLContext,
    @Arg('name', { nullable: true }) name?: string,
  ): Promise<NutrientsResponse> {
    try {
      const nutrientService = this.getNutrientService(ctx);
      const nutrients = await nutrientService.searchNutrientsByName(name || '');
      const total = await nutrientService.getNutrientsCount();
      return {
        nutrients: nutrients as Nutrient[],
        total
      };
    } catch (error) {
      console.error(`Error in searchPrismaNutrients query: ${error}`);
      throw new Error('Failed to search nutrients');
    }
  }

  @Query(() => [Nutrient])
  async prismaNutrientsByParent(
    @Ctx() ctx: GraphQLContext,
    @Arg('parentId', { nullable: true }) parentId?: string,
  ): Promise<Nutrient[]> {
    try {
      const nutrientService = this.getNutrientService(ctx);
      return await nutrientService.getNutrientsByParent(parentId || null) as Nutrient[];
    } catch (error) {
      console.error(`Error in prismaNutrientsByParent query: ${error}`);
      throw new Error('Failed to fetch nutrients by parent');
    }
  }

  @Query(() => String)
  async prismaNutrientsCount(@Ctx() ctx: GraphQLContext): Promise<string> {
    try {
      const nutrientService = this.getNutrientService(ctx);
      const count = await nutrientService.getNutrientsCount();
      return count.toString();
    } catch (error) {
      console.error(`Error in prismaNutrientsCount query: ${error}`);
      throw new Error('Failed to get nutrients count');
    }
  }

  @Mutation(() => Nutrient)
  async createPrismaNutrient(
    @Arg('input') input: CreateNutrientInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<Nutrient> {
    try {
      const nutrientService = this.getNutrientService(ctx);
      return await nutrientService.createNutrient(input) as Nutrient;
    } catch (error) {
      console.error(`Error in createPrismaNutrient mutation: ${error}`);
      throw new Error(`Failed to create nutrient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @Mutation(() => Nutrient)
  async updatePrismaNutrient(
    @Arg('id') id: string,
    @Arg('input') input: UpdateNutrientInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<Nutrient> {
    try {
      const nutrientService = this.getNutrientService(ctx);
      return await nutrientService.updateNutrient(id, input) as Nutrient;
    } catch (error) {
      console.error(`Error in updatePrismaNutrient mutation: ${error}`);
      throw new Error(`Failed to update nutrient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @Mutation(() => Boolean)
  async deletePrismaNutrient(
    @Arg('id') id: string,
    @Ctx() ctx: GraphQLContext
  ): Promise<boolean> {
    try {
      const nutrientService = this.getNutrientService(ctx);
      return await nutrientService.deleteNutrient(id);
    } catch (error) {
      console.error(`Error in deletePrismaNutrient mutation: ${error}`);
      throw new Error(`Failed to delete nutrient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
