import { NutrientCode } from "@/backend/domain/types/NutrientCode";
import { DailyNutrientTotal } from "@/backend/domain/entities/DailyNutrientTotal";
import { PfcBalance } from "@/backend/domain/entities/PfcBalance";

export interface IPfcCalculator {
  calculate(totals: Map<NutrientCode, DailyNutrientTotal>): PfcBalance;
}
