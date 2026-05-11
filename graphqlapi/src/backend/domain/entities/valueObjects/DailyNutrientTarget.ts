import { NutrientCode } from "@/backend/domain/types/NutrientCode";

export class DailyNutrientTarget {
  constructor(
    public readonly nutrientCode: NutrientCode,
    public readonly targetValue: number,
    public readonly unit: string,
  ) {
    if (targetValue < 0) {
      throw new Error("targetValue must be >= 0");
    }
  }

  isEnergyPercent(): boolean {
    return this.unit === "energy_percent";
  }
}
