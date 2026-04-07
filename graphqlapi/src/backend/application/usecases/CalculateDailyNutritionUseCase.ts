import { DailyNutrientAggregatorService } from "../services/calculators/DailyNutrientAggregatorService";
import { PfcCalculatorService } from "../services/calculators/PfcCalculatorService";

import { IDailyNutrientAggregationItem } from "../../domain/interfaces/calculators/IDailyNutrientAggregationItem";

import { DailyNutrientTotal } from "@/backend/domain/entities/DailyNutrientTotal";
import { PfcBalance } from "@/backend/domain/entities/PfcBalance";
import { NutrientCode } from "@/backend/domain/types/NutrientCode";
import { ICalculateDailyNutritionUseCase } from "@/backend/domain/interfaces/usecases/ICalculateDailyNutritionUseCase";
import { IDailyNutrientAggregator } from "@/backend/domain/interfaces/calculators/IDailyNutrientAggregator";
import { IPfcCalculator } from "@/backend/domain/interfaces/calculators/IPfcCalculator";
import { DailyNutritionQueryService } from "@/backend/application/services/DailyNutritionQueryService";

export type CalculateDailyNutritionResult = {
  totals: Map<NutrientCode, DailyNutrientTotal>;
  pfc: PfcBalance;
};

export class CalculateDailyNutritionUseCase implements ICalculateDailyNutritionUseCase {
  constructor(
    private readonly queryService: DailyNutritionQueryService,
    private readonly aggregator: IDailyNutrientAggregator,
    private readonly pfcCalculator: IPfcCalculator,
  ) {}
  async execute(
    userId: string,
    date: Date
  ): Promise<CalculateDailyNutritionResult> {
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
