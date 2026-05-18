import { Gender } from "@/backend/domain/types/Gender";
import { IDailyNutrientAggregationItem } from "../../domain/interfaces/calculators/IDailyNutrientAggregationItem";

import { DailyNutrientTotal } from "@/backend/domain/entities/valueObjects/DailyNutrientTotal";
import { ICalculateDailyNutritionUseCase } from "@/backend/domain/interfaces/usecases/ICalculateDailyNutritionUseCase";
import { IDailyNutrientAggregator } from "@/backend/domain/interfaces/calculators/IDailyNutrientAggregator";
import { IPfcCalculator } from "@/backend/domain/interfaces/calculators/IPfcCalculator";
import { DailyNutritionQueryService } from "@/backend/application/services/DailyNutritionQueryService";
import { INutritionTargetService } from "@/backend/domain/interfaces/INutritionTargetService";
import { IRdiEvaluator } from "@/backend/domain/interfaces/calculators/IRdiEvaluator";

import {
  CalculateDailyNutritionResult,
  DailyNutritionSnapshot,
  CalculateMonthlyNutritionResult,
} from "@/backend/domain/interfaces/usecases/ICalculateDailyNutritionUseCase";

export class CalculateDailyNutritionUseCase implements ICalculateDailyNutritionUseCase {
  constructor(
    private readonly queryService: DailyNutritionQueryService,
    private readonly aggregator: IDailyNutrientAggregator,
    private readonly pfcCalculator: IPfcCalculator,
    private readonly nutrientionTargetService: INutritionTargetService,
    private readonly rdiEvaluator: IRdiEvaluator,
  ) {}
  async execute(
    userId: string,
    date: Date,
  ): Promise<CalculateDailyNutritionResult> {
    // TODO
    const age = 44;
    const gender = Gender.Male;
    // const date = new Date(2026, 0, 17);

    // 1日の栄養素ごとの摂取量
    const items: IDailyNutrientAggregationItem[] =
      await this.queryService.fetchAggregationItems("1", date);
    const totals = this.aggregator.aggregate(items);
    const pfc = this.pfcCalculator.calculate(totals);
    const targets = await this.nutrientionTargetService.findTargets(
      gender,
      age,
    );
    const comparisons = this.rdiEvaluator.evaluate(totals, targets, pfc);
    return {
      totals,
      pfc,
      comparisons,
    };
  }
  async executeMonthly(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<CalculateMonthlyNutritionResult> {
    // TODO
    const age = 44;
    const gender = Gender.Male;
    // const date = new Date(2026, 0, 17);

    // 栄養素ごとの摂取量
    const items: IDailyNutrientAggregationItem[] =
      await this.queryService.fetchAggregationItemsByPeriod("1", from, to);
    console.log(items);

    // 日付ごとにgrouping
    const grouped = new Map<string, IDailyNutrientAggregationItem[]>();
    for (const item of items) {
      const key = item.eatenAt.toISOString().split("T")[0];
      const current = grouped.get(key) ?? [];
      current.push(item);
      grouped.set(key, current);
    }
    console.log(grouped);
    const targets = await this.nutrientionTargetService.findTargets(
      gender,
      age,
    );
    const days: DailyNutritionSnapshot[] = [];
    for (const [date, dailyItems] of grouped) {
      const totals = this.aggregator.aggregate(dailyItems);

      const pfc = this.pfcCalculator.calculate(totals);

      const comparisons = this.rdiEvaluator.evaluate(totals, targets, pfc);

      days.push({
        date,
        totals,
        pfc,
        comparisons,
      });
    }
    days.sort((a, b) => a.date.localeCompare(b.date));

    return {
      days,
    };
  }
}
