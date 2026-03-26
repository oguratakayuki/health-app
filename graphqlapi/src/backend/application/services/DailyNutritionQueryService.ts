import { IDailyNutrientAggregationItem } from "../../domain/interfaces/calculators/IDailyNutrientAggregationItem";
import { IMealRepository } from "../../domain/interfaces/IMealRepository";
import { IIngredientNutrientRepository } from "../../domain/interfaces/IIngredientNutrientRepository";

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

    for (const meal of meals) {
      for (const ingredient of meal.ingredients) {
        const nutrients =
          await this.ingredientNutrientRepository.findByIngredientId(
            ingredient.ingredientId,
          );

        for (const nutrient of nutrients) {
          items.push({
            nutrientCode: nutrient.nutrientCode,
            ingredientAmountGram: ingredient.amountGram,
            nutrientPer100g: nutrient.amountPer100g,
          });
        }
      }
    }

    return items;
  }
}
