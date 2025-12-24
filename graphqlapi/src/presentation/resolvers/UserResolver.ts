// src/presentation/resolvers/UserResolver.ts
import { Query, Resolver, Arg, Int, Ctx } from "type-graphql";
import type { GraphQLContext } from '@/application/types/context';
import type { IUserService } from '@/domain/interfaces/IUserService';
import { User } from '@/infrastructure/graphql/types/User';

@Resolver(() => User)
export class UserResolver {
  /**
   * コンテキストからIUserServiceを取得
   * コンテキストにサービスがない場合はエラーをスロー
   */
  private getUserService(@Ctx() ctx: GraphQLContext): IUserService {
    if (!ctx.userService) {
      throw new Error('UserService is not available in context');
    }
    return ctx.userService;
  }

  @Query(() => [User])
  async users(
    @Ctx() ctx: GraphQLContext,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
  ): Promise<User[]> {
    try {
      const userService = this.getUserService(ctx);
      return await userService.getUsers(limit);
    } catch (error) {
      console.error(`Error in users query: ${error}`);
      throw new Error('Failed to fetch users');
    }
  }
}
