// src/presentation/resolvers/prisma/CategoryResolver.ts
import { Query, Resolver, Ctx } from 'type-graphql';
import type { GraphQLContext } from '@/application/types/context';
import type { CategoryService } from '@/application/services/CategoryService';
import { PrismaCategory } from '@/graphql/types/prisma/Category';

@Resolver(() => PrismaCategory)
export class CategoryResolver {
  /**
   * コンテキストからCategoryServiceを取得
   * コンテキストにサービスがない場合はエラーをスロー
   */
  private getCategoryService(@Ctx() ctx: GraphQLContext): CategoryService {
    if (!ctx.categoryService) {
      throw new Error('CategoryService is not available in context');
    }
    return ctx.categoryService;
  }

  @Query(() => [PrismaCategory])
  async categories(@Ctx() ctx: GraphQLContext): Promise<PrismaCategory[]> {
    try {
      const categoryService = this.getCategoryService(ctx);
      return await categoryService.getAllCategories();
    } catch (error) {
      console.error(`Error in categories query: ${error}`);
      throw new Error('Failed to fetch categories');
    }
  }
}
