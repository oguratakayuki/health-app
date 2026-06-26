import { CreateIngredientInput } from "@/backend/infrastructure/graphql/inputs/CreateIngredientInput";
import { CreateIngredientDto } from "@/backend/application/dtos/Ingredient";
import { Ingredient as IngredientEntity } from "@/backend/domain/entities/Ingredient";
import { Ingredient as GraphQLIngredient } from "@/backend/infrastructure/graphql/types/Ingredient";

export class IngredientPresentationMapper {
  /**
   * 【上り】Presentation (GraphQL Input) ➔ Application (DTO)
   */
  static toCreateDto(input: CreateIngredientInput): CreateIngredientDto {
    return {
      name: input.name || "",
      remarks: input.remarks || null,
      originalName: input.originalName || null,
    };
  }

  /**
   * 【下り】Domain (Entity) ➔ Presentation (GraphQL Output)
   */
  static toGraphQLType(ingredient: IngredientEntity): GraphQLIngredient {
    return {
      id: ingredient.id,
      name: ingredient.name,
      remarks: ingredient.remarks,
      originalName: ingredient.originalName,
      createdAt: ingredient.createdAt,
      updatedAt: ingredient.updatedAt,
    };
  }
}
