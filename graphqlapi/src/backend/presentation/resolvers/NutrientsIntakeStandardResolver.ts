import { Query, Resolver, Arg, Mutation, Ctx, Int } from "type-graphql";
import type { GraphQLContext } from "@/backend/application/types/context";
import type { NutrientsIntakeStandardService } from "@/backend/application/services/NutrientsIntakeStandardService";
import { NutrientsIntakeStandard } from "@/backend/infrastructure/graphql/types/NutrientsIntakeStandard";
import { CreateNutrientsIntakeStandardInput } from "@/backend/infrastructure/graphql/inputs/prisma/CreateNutrientsIntakeStandardInput";
import { UpdateNutrientsIntakeStandardInput } from "@/backend/infrastructure/graphql/inputs/prisma/UpdateNutrientsIntakeStandardInput";

@Resolver(() => NutrientsIntakeStandard)
export class NutrientsIntakeStandardResolver {
  /**
   * コンテキストからサービスを取得
   */
  private getService(
    @Ctx() ctx: GraphQLContext,
  ): NutrientsIntakeStandardService {
    if (!ctx.nutrientsIntakeStandardService) {
      throw new Error(
        "NutrientsIntakeStandardService is not available in context",
      );
    }
    return ctx.nutrientsIntakeStandardService;
  }

  @Query(() => NutrientsIntakeStandard, { nullable: true })
  async nutrientsIntakeStandard(
    @Arg("id") id: string,
    @Ctx() ctx: GraphQLContext,
  ): Promise<NutrientsIntakeStandard | null> {
    try {
      const service = this.getService(ctx);
      const standard = await service.getStandard(id);
      return standard as NutrientsIntakeStandard | null;
    } catch (error) {
      console.error(`Error in nutrientsIntakeStandard query: ${error}`);
      throw new Error("Failed to fetch nutrients intake standard");
    }
  }

  @Query(() => [NutrientsIntakeStandard], {
    name: "nutrientsIntakeStandardsWithFilters",
    description: "性別・年齢でフィルタリングした栄養摂取基準を取得",
  })
  async getNutrientsIntakeStandardsWithFilters(
    @Ctx() ctx: GraphQLContext,
    @Arg("gender", () => String, { nullable: true }) gender?: string,
    @Arg("age", () => Int, { nullable: true }) age?: number,
  ): Promise<NutrientsIntakeStandard[]> {
    console.log(`gender ${gender}`);
    console.log(`age ${age}`);
    try {
      const service = this.getService(ctx);
      const standards = await service.findAllWithFilters({ gender, age });
      return standards as NutrientsIntakeStandard[];
    } catch (error) {
      console.error(
        `Error in getNutrientsIntakeStandardsWithFilters query: ${error}`,
      );
      throw new Error(
        `Failed to fetch standards: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  @Query(() => [NutrientsIntakeStandard])
  async nutrientsIntakeStandards(
    @Ctx() ctx: GraphQLContext,
  ): Promise<NutrientsIntakeStandard[]> {
    try {
      const service = this.getService(ctx);
      const standards = await service.getAllStandards();
      // ドメインモデルの配列をGraphQL型の配列としてキャストして返す
      return standards as NutrientsIntakeStandard[];
    } catch (error) {
      console.error(`Error in nutrientsIntakeStandards query: ${error}`);
      throw new Error("Failed to fetch nutrients intake standards");
    }
  }

  @Query(() => [NutrientsIntakeStandard])
  async nutrientsIntakeStandardsByNutrient(
    @Arg("nutrientId", () => Int) nutrientId: number,
    @Ctx() ctx: GraphQLContext,
  ): Promise<NutrientsIntakeStandard[]> {
    try {
      const service = this.getService(ctx);
      const standards = await service.getStandardsByNutrientId(nutrientId);
      return standards as NutrientsIntakeStandard[];
    } catch (error) {
      console.error(
        `Error in nutrientsIntakeStandardsByNutrient query: ${error}`,
      );
      throw new Error("Failed to fetch standards by nutrient");
    }
  }

  @Mutation(() => NutrientsIntakeStandard)
  async createNutrientsIntakeStandard(
    @Arg("input") input: CreateNutrientsIntakeStandardInput,
    @Ctx() ctx: GraphQLContext,
  ): Promise<NutrientsIntakeStandard> {
    try {
      const service = this.getService(ctx);
      const standard = await service.createStandard(input);
      return standard as NutrientsIntakeStandard;
    } catch (error) {
      console.error(
        `Error in createNutrientsIntakeStandard mutation: ${error}`,
      );
      throw new Error(
        `Failed to create standard: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  @Mutation(() => NutrientsIntakeStandard)
  async updateNutrientsIntakeStandard(
    @Arg("id") id: string,
    @Arg("input") input: UpdateNutrientsIntakeStandardInput,
    @Ctx() ctx: GraphQLContext,
  ): Promise<NutrientsIntakeStandard> {
    try {
      const service = this.getService(ctx);
      const standard = await service.updateStandard(id, input);
      return standard as NutrientsIntakeStandard;
    } catch (error) {
      console.error(
        `Error in updateNutrientsIntakeStandard mutation: ${error}`,
      );
      throw new Error(
        `Failed to update standard: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  @Mutation(() => Boolean)
  async deleteNutrientsIntakeStandard(
    @Arg("id") id: string,
    @Ctx() ctx: GraphQLContext,
  ): Promise<boolean> {
    try {
      const service = this.getService(ctx);
      return await service.deleteStandard(id);
    } catch (error) {
      console.error(
        `Error in deleteNutrientsIntakeStandard mutation: ${error}`,
      );
      throw new Error(
        `Failed to delete standard: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
