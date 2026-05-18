// backend/domain/interfaces/usecases/ICalculateDailyNutritionUseCase.ts
import { DailyNutrientTotal } from "@/backend/domain/entities/valueObjects/DailyNutrientTotal";

export interface ICalculateDailyNutritionUseCase {
  execute(userId: string, date: Date): Promise<CalculateDailyNutritionResult>;
  executeMonthly(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<CalculateMonthlyNutritionResult>;
}
import { PfcBalance } from "@/backend/domain/entities/PfcBalance";
import { NutrientCode } from "@/backend/domain/types/NutrientCode";

export type CalculateDailyNutritionResult = {
  totals: Map<NutrientCode, DailyNutrientTotal>;
  pfc: PfcBalance;
  comparisons: NutrientComparison[];
};
import { NutrientComparison } from "@/backend/domain/entities/valueObjects/NutrientComparison";

export type DailyNutritionSnapshot = {
  date: string;
  totals: Map<NutrientCode, DailyNutrientTotal>;
  pfc: PfcBalance;
  comparisons: NutrientComparison[];
};

export type CalculateMonthlyNutritionResult = {
  days: DailyNutritionSnapshot[];
};
