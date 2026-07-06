import { Mutation, Query, Resolver, Arg, Ctx } from "type-graphql";
import { UserProfile } from "@/backend/infrastructure/graphql/types/UserProfile";
import { ShowUserProfileInput } from "@/backend/infrastructure/graphql/inputs/ShowUserProfileInput";
import { EditUserProfileInput } from "@/backend/infrastructure/graphql/inputs/EditUserProfileInput";
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
    @Ctx() ctx: GraphQLContext,
  ): Promise<UserProfile | null> {
    try {
      const service = this.getUserProfileService(ctx);
      const dto = UserProfilePresentationMapper.toServiceDto(ctx.user!.id);
      const entity = await service.getUserProfile(dto);
      if (!entity) return null;
      return UserProfilePresentationMapper.toGraphQLType(entity);
    } catch (error) {
      console.error(`Error in userProfile query: ${error}`);
      throw new Error("Failed to fetch user profile");
    }
  }

  @Mutation(() => UserProfile, { nullable: true, name: "editUserProfile" })
  async editUserProfile(
    @Ctx() ctx: GraphQLContext,
    @Arg("input") input: EditUserProfileInput,
  ): Promise<UserProfile | null> {
    try {
      const service = this.getUserProfileService(ctx);
      const dto = UserProfilePresentationMapper.toEditServiceDto(input);
      const entity = await service.editUserProfile(dto);
      if (!entity) return null;
      return UserProfilePresentationMapper.toGraphQLType(entity);
    } catch (error) {
      console.error(`Error in editUserProfile mutation: ${error}`);
      throw new Error("Failed to update user profile");
    }
  }
}
