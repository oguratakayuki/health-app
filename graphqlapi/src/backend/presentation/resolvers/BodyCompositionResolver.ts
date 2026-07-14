import { Query, Resolver, Arg, Ctx, Mutation } from "type-graphql";
import { BodyComposition } from "@/backend/infrastructure/graphql/types/BodyComposition";
import { ListBodyCompositionInput } from "@/backend/infrastructure/graphql/inputs/ListBodyCompositionInput";
import { ShowBodyCompositionInput } from "@/backend/infrastructure/graphql/inputs/ShowBodyCompositionInput";
import { EditBodyCompositionInput } from "@/backend/infrastructure/graphql/inputs/EditBodyCompositionInput";
import type { GraphQLContext } from "@/backend/application/types/context";
import { Authorized } from "@/backend/application/auth/decorators";
import { BodyCompositionService } from "@/backend/application/services/BodyCompositionService";
import { BodyCompositionPresentationMapper } from "@/backend/acl/presentation_application/BodyCompositionPresentationMapper";

@Resolver()
export class BodyCompositionResolver {
  private getBodyCompositionService(ctx: GraphQLContext): BodyCompositionService {
    if (!ctx.bodyCompositionService) {
      throw new Error("BodyCompositionService is not available in context");
    }
    return ctx.bodyCompositionService;
  }

  @Query(() => [BodyComposition], { name: "bodyCompositions" })
  @Authorized()
  async bodyCompositions(
    @Arg("input", { nullable: true }) input: ListBodyCompositionInput,
    @Ctx() ctx: GraphQLContext,
  ): Promise<BodyComposition[]> {
    try {
      const service = this.getBodyCompositionService(ctx);
      const dto = {
        userId: ctx.user!.id,
        // 必要に応じて入力をマッピング (現在は空)
      };
      const entities = await service.listBodyCompositions(dto);
      return BodyCompositionPresentationMapper.toGraphQLTypeList(entities);
    } catch (error) {
      console.error(`Error in bodyCompositions query: ${error}`);
      throw new Error("Failed to fetch body compositions");
    }
  }

  @Query(() => BodyComposition, { nullable: true, name: "bodyComposition" })
  @Authorized()
  async bodyComposition(
    @Arg("input") input: ShowBodyCompositionInput,
    @Ctx() ctx: GraphQLContext,
  ): Promise<BodyComposition | null> {
    try {
      const service = this.getBodyCompositionService(ctx);
      const dto = {
        id: input.id,
        userId: ctx.user!.id,
      };
      const entity = await service.showBodyComposition(dto);
      return entity ? BodyCompositionPresentationMapper.toGraphQLType(entity) : null;
    } catch (error) {
      console.error(`Error in bodyComposition query: ${error}`);
      throw new Error("体組成計測データの取得に失敗しました。");
    }
  }

  @Mutation(() => BodyComposition, { name: "editBodyComposition" })
  @Authorized()
  async editBodyComposition(
    @Arg("input") input: EditBodyCompositionInput,
    @Ctx() ctx: GraphQLContext,
  ): Promise<BodyComposition> {
    try {
      const service = this.getBodyCompositionService(ctx);
      const dto = BodyCompositionPresentationMapper.toEditDto(ctx.user!.id, input);
      const entity = await service.editBodyComposition(dto);
      return BodyCompositionPresentationMapper.toGraphQLType(entity);
    } catch (error) {
      console.error(`Error in editBodyComposition mutation: ${error}`);
      throw new Error(`体組成計測データの更新に失敗しました。${error instanceof Error ? error.message : ""}`);
    }
  }
}
