// backend/domain/entities/PfcBalance.ts

export type PfcRatio = {
  protein: number | null;
  fat: number | null;
  carbohydrate: number | null;
};

export class PfcBalance {
  public readonly protein: number | null;
  public readonly fat: number | null;
  public readonly carbohydrate: number | null;

  constructor(ratio: PfcRatio) {
    this.protein = ratio.protein;
    this.fat = ratio.fat;
    this.carbohydrate = ratio.carbohydrate;
  }

  /**
   * P/F/C のいずれかが未計算か
   */
  hasAnyUncalculated(): boolean {
    return (
      this.protein === null || this.fat === null || this.carbohydrate === null
    );
  }

  /**
   * PFCバランスが適正か
   * - 未計算が含まれる場合は false
   */
  isBalanced(): boolean {
    if (this.hasAnyUncalculated()) {
      return false;
    }

    const p = this.protein!;
    const f = this.fat!;
    const c = this.carbohydrate!;

    return (
      this.isProteinInRange(p) &&
      this.isFatInRange(f) &&
      this.isCarbohydrateInRange(c)
    );
  }

  private isProteinInRange(value: number): boolean {
    return value >= 13 && value <= 20;
  }

  private isFatInRange(value: number): boolean {
    return value >= 20 && value <= 30;
  }

  private isCarbohydrateInRange(value: number): boolean {
    return value >= 50 && value <= 65;
  }
}
