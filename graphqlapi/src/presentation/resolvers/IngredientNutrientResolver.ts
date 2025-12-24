// src/presentation/resolvers/IngredientNutrientResolver.ts
import { Query, Resolver, Arg, Int, Ctx } from "type-graphql";
import type { GraphQLContext } from '@/application/types/context';
import type { IIngredientNutrientService } from '@/domain/interfaces/IIngredientNutrientService';
import { IngredientNutrient } from '@/infrastructure/graphql/types/prisma/IngredientNutrient';

@Resolver()
export class IngredientNutrientResolver {
  /**
   * コンテキストからIIngredientNutrientServiceを取得
   * コンテキストにサービスがない場合はエラーをスロー
   */
  private getIngredientNutrientService(@Ctx() ctx: GraphQLContext): IIngredientNutrientService {
    if (!ctx.ingredientNutrientService) {
      throw new Error('IngredientNutrientService is not available in context');
    }
    return ctx.ingredientNutrientService;
  }

  @Query(() => [IngredientNutrient])
  async ingredientNutrients(
    @Ctx() ctx: GraphQLContext,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
  ) {
      const ingredientNutrientService = this.getIngredientNutrientService(ctx);
      return await ingredientNutrientService.getIngredientNutrients(limit);
  }
}
