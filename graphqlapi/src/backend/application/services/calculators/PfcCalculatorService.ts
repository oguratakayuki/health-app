// backend/application/services/calculators/PfcCalculatorService.ts

import { IPfcCalculator } from "@/backend/domain/interfaces/calculators/IPfcCalculator";
import { DailyNutrientTotal } from "@/backend/domain/entities/DailyNutrientTotal";
import { PfcBalance } from "@/backend/domain/entities/PfcBalance";
import { NutrientCode } from "@/backend/domain/types/NutrientCode";

export class PfcCalculatorService implements IPfcCalculator {
  calculate(totals: Map<NutrientCode, DailyNutrientTotal>): PfcBalance {
    const protein = totals.get(NutrientCode.Protein)?.value ?? null;
    const fat = totals.get(NutrientCode.Fat)?.value ?? null;
    const carbohydrate = totals.get(NutrientCode.Carbohydrate)?.value ?? null;

    // 未計算が含まれる場合
    if (protein === null || fat === null || carbohydrate === null) {
      return new PfcBalance({
        protein: null,
        fat: null,
        carbohydrate: null,
      });
    }

    // kcal換算
    const proteinKcal = protein * 4;
    const fatKcal = fat * 9;
    const carbohydrateKcal = carbohydrate * 4;

    const totalKcal = proteinKcal + fatKcal + carbohydrateKcal;

    // すべて 0 の場合（割合不能）
    if (totalKcal === 0) {
      return new PfcBalance({
        protein: null,
        fat: null,
        carbohydrate: null,
      });
    }

    return new PfcBalance({
      protein: (proteinKcal / totalKcal) * 100,
      fat: (fatKcal / totalKcal) * 100,
      carbohydrate: (carbohydrateKcal / totalKcal) * 100,
    });
  }
}
