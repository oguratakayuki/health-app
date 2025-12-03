import { Resolver, Query, Arg, Mutation, ID } from 'type-graphql';
import { ServiceFactory } from '../../services/adapters';
import { Ingredient } from '../../graphql/types/prisma/Ingredient';
import { Nutrient } from '../../graphql/types/prisma/Nutrient';
import { PrismaDish } from '../../graphql/types/prisma/PrismaDish';
import { IngredientNutrient } from '../../graphql/types/prisma/IngredientNutrient';
import { CreateIngredientInput } from '../../graphql/inputs/prisma/CreateIngredientInput';
import { UpdateIngredientInput } from '../../graphql/inputs/prisma/UpdateIngredientInput';

@Resolver()
export class PrismaIngredientResolver {
  private ingredientService = ServiceFactory.createIngredientService();

  @Query(() => [Ingredient])
@Query(() => [Ingredient])
async ingredients(): Promise<Ingredient[]> {
  const ingredients = await this.ingredientService.getAllIngredients();
  return ingredients.map(ingredient => {
    const mappedIngredient: Ingredient = {
      id: ingredient.id.toString(),
      name: ingredient.name ?? undefined,
      remarks: ingredient.remarks ?? undefined,
      originalName: ingredient.originalName ?? undefined,
      createdAt: ingredient.createdAt,
      updatedAt: ingredient.updatedAt,
      nutrients: ingredient.nutrients?.map(nutrient => ({
        id: nutrient.id.toString(),
        name: nutrient.name ?? undefined,
        parentId: nutrient.parentId?.toString(),
        createdAt: nutrient.createdAt,
        updatedAt: nutrient.updatedAt
      })),
      dishes: ingredient.dishes?.map(dish => ({
        id: dish.id.toString(),
        name: dish.name ?? undefined,
        createdAt: dish.createdAt,
        updatedAt: dish.updatedAt
      })),
      ingredientNutrients: ingredient.ingredientNutrients?.map(inNutrient => ({
        id: inNutrient.id.toString(),
        ingredientId: inNutrient.ingredientId?.toString(),
        nutrientId: inNutrient.nutrientId?.toString(),
        contentQuantity: inNutrient.contentQuantity ?? undefined,
        contentUnit: inNutrient.contentUnit ?? undefined,
        contentUnitPer: inNutrient.contentUnitPer ?? undefined,
        contentUnitPerUnit: inNutrient.contentUnitPerUnit ?? undefined,
        createdAt: inNutrient.createdAt,
        updatedAt: inNutrient.updatedAt
      }))
    };

    return mappedIngredient;
    });
  }

  @Query(() => Ingredient, { nullable: true })
  async ingredient(@Arg('id', () => ID) id: string): Promise<Ingredient | null> {
    const ingredient = await this.ingredientService.getIngredientById(BigInt(id));
    if (!ingredient) return null;
    return {
      id: ingredient.id.toString(),
      name: ingredient.name ?? undefined,
      remarks: ingredient.remarks ?? undefined,
      originalName: ingredient.originalName ?? undefined,
      createdAt: ingredient.createdAt,
      updatedAt: ingredient.updatedAt,
      nutrients: ingredient.nutrients?.map(nutrient => ({
        id: nutrient.id.toString(),
        name: nutrient.name ?? undefined,
        parentId: nutrient.parentId?.toString(),
        createdAt: nutrient.createdAt,
        updatedAt: nutrient.updatedAt
      })),
      dishes: ingredient.dishes?.map(dish => ({
        id: dish.id.toString(),
        name: dish.name ?? undefined,
        createdAt: dish.createdAt,
        updatedAt: dish.updatedAt
      })),
      ingredientNutrients: ingredient.ingredientNutrients?.map(inNutrient => ({
        id: inNutrient.id.toString(),
        ingredientId: inNutrient.ingredientId?.toString(),
        nutrientId: inNutrient.nutrientId?.toString(),
        contentQuantity: inNutrient.contentQuantity ?? undefined,
        contentUnit: inNutrient.contentUnit ?? undefined,
        contentUnitPer: inNutrient.contentUnitPer ?? undefined,
        contentUnitPerUnit: inNutrient.contentUnitPerUnit ?? undefined,
        createdAt: inNutrient.createdAt,
        updatedAt: inNutrient.updatedAt
      }))
    };
  }

  @Mutation(() => Ingredient)
  async createIngredient(@Arg('data') data: CreateIngredientInput): Promise<Ingredient> {
    // GraphQLの入力型をサービス層の型に変換
    const createData = {
      name: data.name ?? null,
      remarks: data.remarks ?? null,
      originalName: data.originalName ?? null
    };
    const ingredient = await this.ingredientService.createIngredient(createData);
    return {
      id: ingredient.id.toString(),
      name: ingredient.name ?? undefined,
      remarks: ingredient.remarks ?? undefined,
      originalName: ingredient.originalName ?? undefined,
      createdAt: ingredient.createdAt,
      updatedAt: ingredient.updatedAt,
      nutrients: [],
      dishes: [],
      ingredientNutrients: []
    };
  }

  @Mutation(() => Ingredient)
  async updateIngredient(
    @Arg('id', () => ID) id: string,
    @Arg('data') data: UpdateIngredientInput
  ): Promise<Ingredient> {
    const ingredient = await this.ingredientService.updateIngredient(BigInt(id), data);

    return {
      id: ingredient.id.toString(),
      name: ingredient.name ?? undefined,
      remarks: ingredient.remarks ?? undefined,
      originalName: ingredient.originalName ?? undefined,
      createdAt: ingredient.createdAt,
      updatedAt: ingredient.updatedAt,
      nutrients: [],
      dishes: [],
      ingredientNutrients: []
    };
  }

  @Mutation(() => Boolean)
  async deleteIngredient(@Arg('id', () => ID) id: string): Promise<boolean> {
    await this.ingredientService.deleteIngredient(BigInt(id));
    return true;
  }
}
