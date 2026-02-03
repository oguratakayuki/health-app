// backend/domain/entities/Nutrient.ts

import { NutrientCode } from "../types/NutrientCode";

export class Nutrient {
  readonly code: NutrientCode;
  readonly value: number | null;

  private constructor(code: NutrientCode, value: number | null) {
    this.code = code;
    this.value = value;
  }

  /** 未計算（欠損） */
  static uncalculated(code: NutrientCode): Nutrient {
    return new Nutrient(code, null);
  }

  /** 正常値 */
  static of(code: NutrientCode, value: number): Nutrient {
    if (value < 0) {
      throw new Error(`Nutrient value must be >= 0: ${code}`);
    }
    return new Nutrient(code, value);
  }

  /** 未計算かどうか */
  isUncalculated(): boolean {
    return this.value === null;
  }
}
