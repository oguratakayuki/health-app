import { Query, Resolver, Ctx } from "type-graphql";
import { User } from "../entities/User";

export interface MyContext {
  user?: User | null;
}

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    // context に user が入っていれば返す
    return ctx.user ?? null;
  }
}

