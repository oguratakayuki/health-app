import { Resolver, Query, Ctx } from "type-graphql";
import type { GraphQLContext } from '@/application/types/context';
import type { IngredientService } from '@/application/services/IngredientService';
import { Ingredient } from '@/infrastructure/graphql/types/Ingredient';
import { 
  IngredientWithRelations 
} from '@/domain/entities/Ingredient';

@Resolver()
export class IngredientResolver {
  /**
   * コンテキストからIngredientServiceを取得
   * コンテキストにサービスがない場合はエラーをスロー
   */
  private getIngredientService(@Ctx() ctx: GraphQLContext): IngredientService {
    if (!ctx.ingredientService) {
      throw new Error('IngredientService is not available in context');
    }
    return ctx.ingredientService;
  }

  @Query(() => [Ingredient])
  async ingredients(@Ctx() ctx: GraphQLContext): Promise<IngredientWithRelations[]> {
    try {
      const ingredientService = this.getIngredientService(ctx);
      const ingredients = await ingredientService.getAllIngredients();
      // 既存のマッピングロジックを維持
      return ingredients.map(ingredient => ({
        id: ingredient.id.toString(),
        name: ingredient.name,
        originalName: ingredient.originalName,
        remarks: ingredient.remarks,
        createdAt: ingredient.createdAt,
        updatedAt: ingredient.updatedAt,
        nutrients: ingredient.nutrients?.map((n: any) => ({
          id: n.id,
          name: n.name,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt,
          parentId: n.parentId,
        })),
        dishes: ingredient.dishes?.map((d: any) => ({
          id: d.id,
          name: d.name,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        })),
      }));
    } catch (error) {
      console.error(`Error in ingredients query: ${error}`);
      throw new Error('Failed to fetch ingredients');
    }
  }
}
