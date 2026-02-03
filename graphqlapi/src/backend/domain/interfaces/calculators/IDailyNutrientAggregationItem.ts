import { NutrientCode } from "@/backend/domain/types/NutrientCode";

export interface IDailyNutrientAggregationItem {
  nutrientCode: NutrientCode;
  ingredientAmountGram: number | null;
  nutrientPer100g: number | null;
}
