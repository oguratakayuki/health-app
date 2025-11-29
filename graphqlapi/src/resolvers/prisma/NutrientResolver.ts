// src/resolvers/prisma/NutrientResolver.ts
import { Query, Resolver, Arg, Mutation, ObjectType, Field } from 'type-graphql';
import { ServiceFactory } from '../../services/adapters';
import { PrismaNutrient } from '../../graphql/types/prisma/Nutrient';
import { CreateNutrientInput } from '../../graphql/inputs/prisma/CreateNutrientInput';
import { UpdateNutrientInput } from '../../graphql/inputs/prisma/UpdateNutrientInput';

@ObjectType()
class NutrientsResponse {
  @Field(() => [PrismaNutrient])
  nutrients!: PrismaNutrient[];

  @Field()
  total!: number;
}

@Resolver(() => PrismaNutrient)
export class PrismaNutrientResolver {
  private nutrientService = ServiceFactory.createNutrientService();

  @Query(() => PrismaNutrient, { nullable: true })
  async prismaNutrient(@Arg('id') id: string): Promise<PrismaNutrient | null> {
    try {
      const nutrient = await this.nutrientService.getNutrient(id);
      return nutrient as PrismaNutrient;
    } catch (error) {
      console.error(`Error in prismaNutrient query: ${error}`);
      throw new Error('Failed to fetch nutrient');
    }
  }

  @Query(() => [PrismaNutrient])
  async prismaNutrients(): Promise<PrismaNutrient[]> {
    try {
      return await this.nutrientService.getAllNutrients() as PrismaNutrient[];
    } catch (error) {
      console.error(`Error in prismaNutrients query: ${error}`);
      throw new Error('Failed to fetch nutrients');
    }
  }

  @Query(() => NutrientsResponse)
  async searchPrismaNutrients(@Arg('name', { nullable: true }) name?: string): Promise<NutrientsResponse> {
    try {
      const nutrients = await this.nutrientService.searchNutrientsByName(name || '');
      const total = await this.nutrientService.getNutrientsCount();
      return {
        nutrients: nutrients as PrismaNutrient[],
        total
      };
    } catch (error) {
      console.error(`Error in searchPrismaNutrients query: ${error}`);
      throw new Error('Failed to search nutrients');
    }
  }

  @Query(() => [PrismaNutrient])
  async prismaNutrientsByParent(@Arg('parentId', { nullable: true }) parentId?: string): Promise<PrismaNutrient[]> {
    try {
      return await this.nutrientService.getNutrientsByParent(parentId || null) as PrismaNutrient[];
    } catch (error) {
      console.error(`Error in prismaNutrientsByParent query: ${error}`);
      throw new Error('Failed to fetch nutrients by parent');
    }
  }

  @Query(() => String)
  async prismaNutrientsCount(): Promise<string> {
    try {
      const count = await this.nutrientService.getNutrientsCount();
      return count.toString();
    } catch (error) {
      console.error(`Error in prismaNutrientsCount query: ${error}`);
      throw new Error('Failed to get nutrients count');
    }
  }

  @Mutation(() => PrismaNutrient)
  async createPrismaNutrient(@Arg('input') input: CreateNutrientInput): Promise<PrismaNutrient> {
    try {
      return await this.nutrientService.createNutrient(input) as PrismaNutrient;
    } catch (error) {
      console.error(`Error in createPrismaNutrient mutation: ${error}`);
      throw new Error(`Failed to create nutrient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @Mutation(() => PrismaNutrient)
  async updatePrismaNutrient(
    @Arg('id') id: string,
    @Arg('input') input: UpdateNutrientInput
  ): Promise<PrismaNutrient> {
    try {
      return await this.nutrientService.updateNutrient(id, input) as PrismaNutrient;
    } catch (error) {
      console.error(`Error in updatePrismaNutrient mutation: ${error}`);
      throw new Error(`Failed to update nutrient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @Mutation(() => Boolean)
  async deletePrismaNutrient(@Arg('id') id: string): Promise<boolean> {
    try {
      return await this.nutrientService.deleteNutrient(id);
    } catch (error) {
      console.error(`Error in deletePrismaNutrient mutation: ${error}`);
      throw new Error(`Failed to delete nutrient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
