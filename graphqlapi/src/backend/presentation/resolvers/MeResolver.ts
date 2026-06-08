// src/backend/presentation/resolvers/MeResolver.ts
import { Query, Resolver, Ctx } from "type-graphql";
import { Authorized } from "@/backend/application/auth/decorators";
import { User } from "@/backend/infrastructure/graphql/types/User";
import type { GraphQLContext } from "@/backend/application/types/context";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  @Authorized()
  async me(@Ctx() ctx: GraphQLContext): Promise<User | null> {
    // context に user が入っていれば返す
    // (AuthResolverのsignInで設定される)
    return ctx.user ?? null;
  }
}
