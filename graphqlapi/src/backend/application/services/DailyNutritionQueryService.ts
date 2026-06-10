import { IDailyNutrientAggregationItem } from "@/backend/domain/interfaces/calculators/IDailyNutrientAggregationItem";
import { IMealRepository } from "@/backend/domain/interfaces/IMealRepository";
import { IIngredientNutrientRepository } from "@backend/domain/interfaces/IIngredientNutrientRepository";

export class DailyNutritionQueryService {
  constructor(
    private mealRepository: IMealRepository,
    private ingredientNutrientRepository: IIngredientNutrientRepository,
  ) {}

  async fetchAggregationItems(
    userId: string,
    date: Date,
  ): Promise<IDailyNutrientAggregationItem[]> {
    const meals = await this.mealRepository.findByUserAndDate(userId, date);

    const items: IDailyNutrientAggregationItem[] = [];
    // ⚪︎月x日 朝食など、１回の食事ごとのloop
    for (const meal of meals) {
      // カレーなど、料理ごとのloop
      for (const mealDish of meal.mealDishes) {
        // ジャガイモ、などの料理に含まれる食材ごとのloop
        for (const dishIngredient of mealDish.dish.dishIngredients) {
          // 食材に含まれる栄養素情報を取得
          const ingredientNutrients =
            await this.ingredientNutrientRepository.findByIngredientId(
              dishIngredient.ingredientId.toString(),
            );
          // 栄養素ごとに、それがどれだけ入っているか、足し合わせる
          // どれだけ入っているかは、
          // 食材の量 x 食材100gあたりの栄養素含有量
          for (const ingredientNutrient of ingredientNutrients) {
            items.push({
              nutrientCode: ingredientNutrient.nutrient.code,
              // 料理に含まれる食材の量
              ingredientAmountGram: dishIngredient.contentQuantity,
              // 100gあたりの栄養素の含有量()
              // 栄養素に対して単位が紐づいているので、ここで単位がgかkcalかは
              // 情報として載せなくて良い
              nutrientPer100g: ingredientNutrient.contentQuantity,
            });
          }
        }
      }
    }
    return items;
  }
  async fetchAggregationItemsByPeriod(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<IDailyNutrientAggregationItem[]> {
    const meals = await this.mealRepository.findByUserAndPeriod(
      userId,
      from,
      to,
    );

    const items: IDailyNutrientAggregationItem[] = [];

    for (const meal of meals) {
      for (const mealDish of meal.mealDishes) {
        for (const dishIngredient of mealDish.dish.dishIngredients) {
          const ingredientNutrients =
            await this.ingredientNutrientRepository.findByIngredientId(
              dishIngredient.ingredientId,
            );

          for (const ingredientNutrient of ingredientNutrients) {
            items.push({
              eatenAt: meal.mealDate,
              nutrientCode: ingredientNutrient.nutrient.code,
              ingredientAmountGram: dishIngredient.contentQuantity,
              nutrientPer100g: ingredientNutrient.contentQuantity,
            });
          }
        }
      }
    }

    return items;
  }
}
