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
    date: Date,
  ): Promise<CalculateDailyNutritionResult> {
    // 1日の栄養素ごとの摂取量
    const items: IDailyNutrientAggregationItem[] =
      await this.queryService.fetchAggregationItems("1", new Date(2026, 0, 17));
    console.log(items);
    const totals = this.aggregator.aggregate(items);
    console.log(totals);

    const pfc = this.pfcCalculator.calculate(totals);
    console.log(pfc);

    return {
      totals,
      pfc,
    };
  }
}
