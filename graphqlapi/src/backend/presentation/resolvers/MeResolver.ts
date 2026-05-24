import { Query, Resolver, Ctx } from "type-graphql";
import { Authorized } from "@/backend/application/auth/decorators";
import { User } from "@/backend/infrastructure/graphql/types/User";
import { GraphQLContext } from "@/backend/application/types/context";

export interface MyContext {
  user?: User | null;
}

@Resolver()
export class MeResolver {
  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    // context に user が入っていれば返す
    // (AuthResolverのsignInで設定される)
    return ctx.user ?? null;
  }
}
