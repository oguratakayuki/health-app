import { NutrientCode } from "@/backend/domain/types/NutrientCode";
import { DailyNutrientTotal } from "@/backend/domain/entities/DailyNutrientTotal";
import { IDailyNutrientAggregationItem } from "./IDailyNutrientAggregationItem";

export interface IDailyNutrientAggregator {
  aggregate(
    items: IDailyNutrientAggregationItem[],
  ): Map<NutrientCode, DailyNutrientTotal>;
}
