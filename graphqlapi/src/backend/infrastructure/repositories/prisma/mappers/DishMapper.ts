import {
  Dish,
  DishWithIngredients,
} from "@/backend/domain/entities/Dish";
import { Dish as PrismaDish, DishIngredient as PrismaDishIngredient, Ingredient as PrismaIngredient } from "@prisma/client";

// Define a type for Prisma Dish with necessary relations
type PrismaDishWithIngredients = PrismaDish & {
  dishIngredients: (PrismaDishIngredient & {
    ingredient: PrismaIngredient;
  })[];
};

export class DishMapper {
  /**
   * PrismaのDishをDish型にマッピング
   */
  static mapToDish(prismaDish: PrismaDish): Dish {
    return {
      id: prismaDish.id.toString(),
      name: prismaDish.name,
      createdAt: prismaDish.createdAt,
      updatedAt: prismaDish.updatedAt,
    };
  }

  /**
   * PrismaのDishをDishWithIngredients型にマッピング
   */
  static mapToDishWithIngredients(
    prismaDish: PrismaDishWithIngredients,
  ): DishWithIngredients {
    const baseDish = DishMapper.mapToDish(prismaDish);
    return {
      ...baseDish,
      dishIngredients: prismaDish.dishIngredients.map((di) => ({
        id: di.id.toString(),
        dishId: di.dishId.toString(),
        ingredientId: di.ingredientId.toString(),
        contentQuantity: di.contentQuantity,
        contentUnit: di.contentUnit,
        createdAt: di.createdAt,
        updatedAt: di.updatedAt,
        ingredient: {
          id: di.ingredient.id.toString(),
          name: di.ingredient.name,
          remarks: di.ingredient.remarks,
          originalName: di.ingredient.originalName,
          createdAt: di.ingredient.createdAt,
          updatedAt: di.ingredient.updatedAt,
        },
      })),
    };
  }
}
