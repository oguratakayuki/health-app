import { Resolver, Query, Ctx, Mutation, Arg } from "type-graphql";
import type { GraphQLContext } from "@/backend/application/types/context";
import type { IngredientService } from "@/backend/application/services/IngredientService";
import { Ingredient } from "@/backend/infrastructure/graphql/types/Ingredient";
import { CreateIngredientInput } from "@/backend/infrastructure/graphql/inputs/CreateIngredientInput";
import { UpdateIngredientInput } from "@/backend/infrastructure/graphql/inputs/UpdateIngredientInput";

import { IngredientWithRelations } from "@/backend/domain/entities/Ingredient";
import { Authorized } from "@/backend/application/auth/decorators";
import { IngredientPresentationMapper } from "@/backend/acl/presentation_application/IngredientPresentationMapper";

@Resolver()
export class IngredientResolver {
  /**
   * コンテキストからIngredientServiceを取得
   * コンテキストにサービスがない場合はエラーをスロー
   */
  private getIngredientService(@Ctx() ctx: GraphQLContext): IngredientService {
    if (!ctx.ingredientService) {
      throw new Error("IngredientService is not available in context");
    }
    return ctx.ingredientService;
  }

  @Query(() => [Ingredient])
  @Authorized()
  async ingredients(@Ctx() ctx: GraphQLContext): Promise<Ingredient[]> {
    try {
      const ingredientService = this.getIngredientService(ctx);
      const ingredients = await ingredientService.getAllIngredients();
      return ingredients.map((ingredient) => ({
        id: ingredient.id.toString(),
        name: ingredient.name,
        originalName: ingredient.originalName ?? undefined,
        remarks: ingredient.remarks ?? undefined,
        createdAt: ingredient.createdAt,
        updatedAt: ingredient.updatedAt,
      }));
    } catch (error) {
      console.error(`Error in ingredients query: ${error}`);
      throw new Error("Failed to fetch ingredients");
    }
  }

  @Mutation(() => Ingredient, { name: "createIngredient" })
  @Authorized()
  async createIngredient(
    @Arg("input") input: CreateIngredientInput,
    @Ctx() ctx: GraphQLContext,
  ): Promise<Ingredient> {
    try {
      const ingredientService = this.getIngredientService(ctx);
      const dto = IngredientPresentationMapper.toCreateDto(input);
      const ingredient = await ingredientService.createIngredient(dto);
      return IngredientPresentationMapper.toGraphQLType(ingredient);
    } catch (error) {
      console.error(`Error in createIngredient mutation: ${error}`);
      throw new Error(
        `Failed to create ingredient: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  @Mutation(() => Ingredient, { name: "updateIngredient" })
  @Authorized()
  async updateIngredient(
    @Arg("id") id: string,
    @Arg("input") input: UpdateIngredientInput,
    @Ctx() ctx: GraphQLContext,
  ): Promise<Ingredient> {
    try {
      const ingredientService = this.getIngredientService(ctx);
      const dto = IngredientPresentationMapper.toCreateDto(input);
      const ingredient = await ingredientService.updateIngredient(id, dto);
      return IngredientPresentationMapper.toGraphQLType(ingredient);
    } catch (error) {
      console.error(`Error in updateIngredient mutation: ${error}`);
      throw new Error(
        `Failed to update ingredient: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
