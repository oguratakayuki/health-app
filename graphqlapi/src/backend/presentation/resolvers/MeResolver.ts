import { Query, Resolver, Ctx } from "type-graphql";
import { User } from "@/backend/infrastructure/graphql/types/User";

export interface MyContext {
  user?: User | null;
}

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    // context に user が入っていれば返す
    // (AuthResolverのsignInで設定される)
    return ctx.user ?? null;
  }
}
