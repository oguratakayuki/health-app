import { DailyNutrientAggregatorService } from "../services/calculators/DailyNutrientAggregatorService";
import { PfcCalculatorService } from "../services/calculators/PfcCalculatorService";

import { IDailyNutrientAggregationItem } from "../../domain/interfaces/calculators/IDailyNutrientAggregationItem";
import { NutrientCode } from "../../domain/types/NutrientCode";
import { DailyNutrientTotal } from "../../domain/entities/DailyNutrientTotal";
import { PfcBalance } from "../../domain/entities/PfcBalance";

export interface CalculateDailyNutritionResult {
  totals: Map<NutrientCode, DailyNutrientTotal>;
  pfc: PfcBalance;
}

export class CalculateDailyNutritionUseCase {
  private aggregator = new DailyNutrientAggregatorService();
  private pfcCalculator = new PfcCalculatorService();

  execute(): CalculateDailyNutritionResult {
    const items: IDailyNutrientAggregationItem[] = [
      {
        nutrientCode: NutrientCode.Protein,
        ingredientAmountGram: 100,
        nutrientPer100g: 20,
      },

      {
        nutrientCode: NutrientCode.Protein,
        ingredientAmountGram: 50,
        nutrientPer100g: 10,
      },

      {
        nutrientCode: NutrientCode.Fat,
        ingredientAmountGram: 100,
        nutrientPer100g: 10,
      },

      {
        nutrientCode: NutrientCode.Carbohydrate,
        ingredientAmountGram: 200,
        nutrientPer100g: 30,
      },
    ];

    const totals = this.aggregator.aggregate(items);

    const pfc = this.pfcCalculator.calculate(totals);

    return {
      totals,
      pfc,
    };
  }
}
