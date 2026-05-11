import { DailyNutrientTotal } from "@/backend/domain/entities/valueObjects/DailyNutrientTotal";
import { DailyNutrientTarget } from "@/backend/domain/entities/valueObjects/DailyNutrientTarget";
import { NutrientComparison } from "@/backend/domain/entities/valueObjects/NutrientComparison";
import { NutrientCode } from "@/backend/domain/types/NutrientCode";
import { PfcBalance } from "@/backend/domain/entities/PfcBalance";

export interface IRdiEvaluator {
  evaluate(
    totals: Map<NutrientCode, DailyNutrientTotal>,
    targets: DailyNutrientTarget[],
    pfc: PfcBalance,
  ): NutrientComparison[];
}
