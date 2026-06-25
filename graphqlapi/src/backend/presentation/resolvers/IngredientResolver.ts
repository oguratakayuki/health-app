import { Resolver, Query, Ctx } from "type-graphql";
import type { GraphQLContext } from "@/backend/application/types/context";
import type { IngredientService } from "@/backend/application/services/IngredientService";
import { Ingredient } from "@/backend/infrastructure/graphql/types/Ingredient";
import { IngredientWithRelations } from "@/backend/domain/entities/Ingredient";
import { Authorized } from "@/backend/application/auth/decorators";

@Resolver()
export class IngredientResolver {
  /**
   * コンテキストからIngredientServiceを取得
   * コンテキストにサービスがない場合はエラーをスロー
   */
  private getIngredientService(@Ctx() ctx: GraphQLContext): IngredientService {
    if (!ctx.ingredientService) {
      throw new Error("IngredientService is not available in context");
    }
    return ctx.ingredientService;
  }

  @Query(() => [Ingredient])
  @Authorized()
  async ingredients(@Ctx() ctx: GraphQLContext): Promise<Ingredient[]> {
    try {
      const ingredientService = this.getIngredientService(ctx);
      const ingredients = await ingredientService.getAllIngredients();
      return ingredients.map((ingredient) => ({
        id: ingredient.id.toString(),
        name: ingredient.name,
        originalName: ingredient.originalName ?? undefined,
        remarks: ingredient.remarks ?? undefined,
        createdAt: ingredient.createdAt,
        updatedAt: ingredient.updatedAt,
      }));
    } catch (error) {
      console.error(`Error in ingredients query: ${error}`);
      throw new Error("Failed to fetch ingredients");
    }
  }
}
