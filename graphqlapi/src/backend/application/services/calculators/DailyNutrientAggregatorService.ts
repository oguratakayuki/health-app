// backend/application/services/calculators/DailyNutrientAggregatorService.ts

import { IDailyNutrientAggregator } from "@/backend/domain/interfaces/calculators/IDailyNutrientAggregator";
import { IDailyNutrientAggregationItem } from "@/backend/domain/interfaces/calculators/IDailyNutrientAggregationItem";
import { DailyNutrientTotal } from "@/backend/domain/entities/DailyNutrientTotal";
import { NutrientCode } from "@/backend/domain/types/NutrientCode";

export class DailyNutrientAggregatorService implements IDailyNutrientAggregator {
  aggregate(
    items: IDailyNutrientAggregationItem[],
  ): Map<NutrientCode, DailyNutrientTotal> {
    const grouped = new Map<NutrientCode, IDailyNutrientAggregationItem[]>();

    for (const item of items) {
      const list = grouped.get(item.nutrientCode) ?? [];
      list.push(item);
      grouped.set(item.nutrientCode, list);
    }

    const result = new Map<NutrientCode, DailyNutrientTotal>();

    for (const [nutrientCode, nutrientItems] of Array.from(grouped.entries())) {
      let total = 0;
      let hasNull = false;

      for (const item of nutrientItems) {
        const { ingredientAmountGram, nutrientPer100g } = item;

        if (
          (ingredientAmountGram !== null && ingredientAmountGram < 0) ||
          (nutrientPer100g !== null && nutrientPer100g < 0)
        ) {
          throw new Error("Nutrient values must not be negative");
        }

        if (ingredientAmountGram === null || nutrientPer100g === null) {
          hasNull = true;
          break;
        }

        total += (ingredientAmountGram * nutrientPer100g) / 100;
      }

      result.set(
        nutrientCode,
        new DailyNutrientTotal(nutrientCode, hasNull ? null : total),
      );
    }

    return result;
  }
}
