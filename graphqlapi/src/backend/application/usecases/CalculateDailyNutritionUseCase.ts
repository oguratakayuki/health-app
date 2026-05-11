import { DailyNutrientAggregatorService } from "../services/calculators/DailyNutrientAggregatorService";
import { PfcCalculatorService } from "../services/calculators/PfcCalculatorService";
import { Gender } from "@/backend/domain/types/Gender";

import { IDailyNutrientAggregationItem } from "../../domain/interfaces/calculators/IDailyNutrientAggregationItem";
import { INutrientsIntakeStandardService } from "@/backend/domain/interfaces/INutrientsIntakeStandardService";

import { DailyNutrientTotal } from "@/backend/domain/entities/DailyNutrientTotal";
import { PfcBalance } from "@/backend/domain/entities/PfcBalance";
import { NutrientCode } from "@/backend/domain/types/NutrientCode";
import { ICalculateDailyNutritionUseCase } from "@/backend/domain/interfaces/usecases/ICalculateDailyNutritionUseCase";
import { IDailyNutrientAggregator } from "@/backend/domain/interfaces/calculators/IDailyNutrientAggregator";
import { IPfcCalculator } from "@/backend/domain/interfaces/calculators/IPfcCalculator";
import { DailyNutritionQueryService } from "@/backend/application/services/DailyNutritionQueryService";
import { INutritionTargetService } from "@/backend/domain/interfaces/INutritionTargetService";

export type CalculateDailyNutritionResult = {
  totals: Map<NutrientCode, DailyNutrientTotal>;
  pfc: PfcBalance;
};

export class CalculateDailyNutritionUseCase implements ICalculateDailyNutritionUseCase {
  constructor(
    private readonly queryService: DailyNutritionQueryService,
    private readonly aggregator: IDailyNutrientAggregator,
    private readonly pfcCalculator: IPfcCalculator,
    private readonly nutrientionTargetService: INutritionTargetService,
  ) {}
  async execute(
    userId: string,
    date: Date,
  ): Promise<CalculateDailyNutritionResult> {
    // TODO
    const age = 44;
    const gender = Gender.Male;

    // 1日の栄養素ごとの摂取量
    const items: IDailyNutrientAggregationItem[] =
      await this.queryService.fetchAggregationItems("1", new Date(2026, 0, 17));
    const totals = this.aggregator.aggregate(items);
    const pfc = this.pfcCalculator.calculate(totals);
    const targets = await this.nutrientionTargetService.findTargets(
      gender,
      age,
    );
    console.log(targets);

    return {
      totals,
      pfc,
    };
  }
}
