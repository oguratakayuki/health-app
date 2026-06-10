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
      id: Number(m.id),
      mealDate: m.mealDate,
      category: m.category,
      startTime: m.startTime,
      endTime: m.endTime,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      userId: Number(m.userId),
      dishes: m.mealDishes.map((md) => ({
        id: Number(md.dish.id),
        name: md.dish.name,
        createdAt: md.dish.createdAt,
        updatedAt: md.dish.updatedAt,
        dishIngredients: md.dish.dishIngredients.map((di) => ({
          id: Number(di.id),
          dishId: Number(di.dishId),
          ingredientId: Number(di.ingredientId),
          contentQuantity: di.contentQuantity,
          contentUnit: di.contentUnit,
          createdAt: di.createdAt,
          updatedAt: di.updatedAt,
        })),
      })),
      mealDishes: m.mealDishes.map((md) => ({
        id: Number(md.id),
        mealId: Number(md.mealId),
        dishId: Number(md.dishId),
        createdAt: md.createdAt,
        updatedAt: md.updatedAt,
        dish: {
          id: Number(md.dish.id),
          name: md.dish.name,
          createdAt: md.dish.createdAt,
          updatedAt: md.dish.updatedAt,
          dishIngredients: md.dish.dishIngredients.map((di) => ({
            id: Number(di.id),
            dishId: Number(di.dishId),
            ingredientId: Number(di.ingredientId),
            contentQuantity: di.contentQuantity,
            contentUnit: di.contentUnit,
            createdAt: di.createdAt,
            updatedAt: di.updatedAt,
          })),
        },
      })),
    };
  }
}
