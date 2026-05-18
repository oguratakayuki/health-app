import { IRdiEvaluator } from "@/backend/domain/interfaces/calculators/IRdiEvaluator";
import { DailyNutrientTotal } from "@/backend/domain/entities/valueObjects/DailyNutrientTotal";
import { DailyNutrientTarget } from "@/backend/domain/entities/valueObjects/DailyNutrientTarget";
import { NutrientComparison } from "@/backend/domain/entities/valueObjects/NutrientComparison";
import { NutrientCode } from "@/backend/domain/types/NutrientCode";
import { PfcBalance } from "@/backend/domain/entities/PfcBalance";

export class RdiEvaluatorService implements IRdiEvaluator {
  evaluate(
    totals: Map<NutrientCode, DailyNutrientTotal>,
    targets: DailyNutrientTarget[],
    pfc: PfcBalance,
  ): NutrientComparison[] {
    return targets.map((target) => {
      let intake: number | null = null;

      // PFC系（energy_percent）
      if (target.unit === "energy_percent") {
        switch (target.nutrientCode) {
          case NutrientCode.Fat:
            intake = pfc.fat;
            break;

          case NutrientCode.Carbohydrate:
            intake = pfc.carbohydrate;
            break;

          case NutrientCode.Protein:
            intake = pfc.protein;
            break;

          default:
            intake = null;
        }
      } else {
        // 通常栄養素
        const total = totals.get(target.nutrientCode);
        intake = total?.value ?? null;
      }

      if (
        intake === null ||
        target.targetValue === null ||
        target.targetValue <= 0
      ) {
        return new NutrientComparison(
          target.nutrientCode,
          intake,
          target.targetValue,
          null,
        );
      }

      return new NutrientComparison(
        target.nutrientCode,
        intake,
        target.targetValue,
        (intake / target.targetValue) * 100,
      );
    });
  }
}
