import { Prisma, Meal as PrismaMeal } from "@prisma/client";

import { MealWithDishes, Meal } from "@backend/domain/entities/Meal";
type PrismaMealWithRelations = Prisma.MealGetPayload<{
  include: {
    mealDishes: {
      include: {
        dish: {
          include: {
            dishIngredients: true;
          };
        };
      };
    };
  };
}>;

export class MealRepositoryMapper {
  static mapToMeal(m: PrismaMeal): Meal {
    return {
      id: Number(m.id),
      mealDate: m.mealDate,
      category: m.category,
      startTime: m.startTime,
      endTime: m.endTime,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      userId: Number(m.userId),
    };
  }
  static mapToMealWithDishes(m: PrismaMealWithRelations): MealWithDishes {
    return {
      // 1. Meal の基本フィールド
      id: Number(m.id),
      userId: Number(m.userId),
      mealDate: m.mealDate,
      startTime: m.startTime,
      endTime: m.endTime,
      category: m.category,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,

      // 2. dishes のマッピング (重複を排除し、共通ヘルパーを使用)
      // m.mealDishes（中間テーブル）から dish 情報を抽出し、正しい DishWithIngredients[] 型を組み立てる
      dishes: m.mealDishes.map((md) => this.mapToDishWithIngredients(md.dish)),

      mealDishes: m.mealDishes.map((md) => ({
        id: Number(m.id),
        userId: Number(m.userId),
        mealDate: m.mealDate,
        startTime: m.startTime,
        endTime: m.endTime,
        category: m.category,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,

        // 関連する料理のプロパティ
        dish: this.mapToDishWithIngredients(md.dish),
      })),
    };
  }

  private static mapToDishWithIngredients(dish: any): DishWithIngredients {
    return {
      id: Number(dish.id),
      name: dish.name,
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt,
      dishIngredients: dish.dishIngredients.map((di: any) => ({
        id: Number(di.id),
        dishId: Number(di.dishId),
        ingredientId: Number(di.ingredientId),
        contentQuantity: di.contentQuantity,
        contentUnit: di.contentUnit,
        createdAt: di.createdAt,
        updatedAt: di.updatedAt,
      })),
    };
  }
}
