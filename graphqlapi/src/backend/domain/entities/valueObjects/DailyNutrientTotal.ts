// backend/domain/entities/DailyNutrientTotal.ts

import { NutrientCode } from "@/backend/domain/types/NutrientCode";

export class DailyNutrientTotal {
  public readonly nutrientCode: NutrientCode;
  public readonly value: number | null;

  constructor(nutrientCode: NutrientCode, value: number | null) {
    this.nutrientCode = nutrientCode;
    this.value = value;
  }

  /**
   * 未計算かどうか
   * - ingredientAmountGram / nutrientPer100g に null が含まれた場合
   */
  isUncalculated(): boolean {
    return this.value === null;
  }

  /**
   * 計算済みかどうか（補助）
   */
  isCalculated(): boolean {
    return this.value !== null;
  }
}
