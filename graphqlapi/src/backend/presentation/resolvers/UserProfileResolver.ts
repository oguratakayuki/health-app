import { Query, Resolver, Arg, Ctx } from "type-graphql";
import { UserProfile } from "@/backend/infrastructure/graphql/types/UserProfile";
import { ShowUserProfileInput } from "@/backend/infrastructure/graphql/inputs/ShowUserProfileInput";
import type { GraphQLContext } from "@/backend/application/types/context";
import { UserProfileService } from "@/backend/application/services/UserProfileService";
import { UserProfilePresentationMapper } from "@/backend/acl/presentation_application/UserProfilePresentationMapper";

@Resolver()
export class UserProfileResolver {
  private getUserProfileService(ctx: GraphQLContext): UserProfileService {
    if (!ctx.userProfileService) {
      throw new Error("UserProfileService is not available in context");
    }
    return ctx.userProfileService;
  }

  @Query(() => UserProfile, { nullable: true, name: "userProfile" })
  async userProfile(
    @Arg("input", { nullable: true }) input?: ShowUserProfileInput,
    @Ctx() ctx: GraphQLContext,
  ): Promise<UserProfile | null> {
    try {
      const service = this.getUserProfileService(ctx);
      const dto = UserProfilePresentationMapper.toServiceDto(ctx.user!.id, input!);
      const entity = await service.getUserProfile(dto);
      
      if (!entity) return null;
      return UserProfilePresentationMapper.toGraphQLType(entity);
    } catch (error) {
      console.error(`Error in userProfile query: ${error}`);
      throw new Error("Failed to fetch user profile");
    }
  }
}
