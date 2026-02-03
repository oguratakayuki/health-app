import { DailyNutrientTotal } from "../../entities/DailyNutrientTotal";
import { PfcBalance } from "../../entities/PfcBalance";

export interface IPfcCalculator {
  calculate(dailyTotal: DailyNutrientTotal): PfcBalance | null;
}
