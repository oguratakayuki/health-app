// backend/application/services/calculators/__tests__/PfcCalculatorService.spec.ts

import { describe, it, expect } from "vitest";
import { PfcCalculatorService } from "@/backend/application/services/calculators/PfcCalculatorService";
import { DailyNutrientTotal } from "@/backend/domain/entities/DailyNutrientTotal";
import { NutrientCode } from "@/backend/domain/types/NutrientCode";

describe("PfcCalculatorService", () => {
  const service = new PfcCalculatorService();

  it("PFC がすべて計算できる場合、割合を返す", () => {
    const totals = new Map([
      [NutrientCode.Protein, new DailyNutrientTotal(NutrientCode.Protein, 75)], // 300kcal
      [NutrientCode.Fat, new DailyNutrientTotal(NutrientCode.Fat, 50)], // 450kcal
      [
        NutrientCode.Carbohydrate,
        new DailyNutrientTotal(NutrientCode.Carbohydrate, 250),
      ], // 1000kcal
    ]);

    const result = service.calculate(totals);

    expect(result.protein).toBeCloseTo(17.1, 1);
    expect(result.fat).toBeCloseTo(25.7, 1);
    expect(result.carbohydrate).toBeCloseTo(57.1, 1);
    expect(result.hasAnyUncalculated()).toBe(false);
  });

  it("いずれかが未計算(null)の場合、すべて null になる", () => {
    const totals = new Map([
      [
        NutrientCode.Protein,
        new DailyNutrientTotal(NutrientCode.Protein, null),
      ],
      [NutrientCode.Fat, new DailyNutrientTotal(NutrientCode.Fat, 50)],
      [
        NutrientCode.Carbohydrate,
        new DailyNutrientTotal(NutrientCode.Carbohydrate, 250),
      ],
    ]);

    const result = service.calculate(totals);

    expect(result.protein).toBeNull();
    expect(result.fat).toBeNull();
    expect(result.carbohydrate).toBeNull();
    expect(result.hasAnyUncalculated()).toBe(true);
  });

  it("PFC がすべて 0 の場合はすべて null を返す", () => {
    const totals = new Map([
      [NutrientCode.Protein, new DailyNutrientTotal(NutrientCode.Protein, 0)],
      [NutrientCode.Fat, new DailyNutrientTotal(NutrientCode.Fat, 0)],
      [
        NutrientCode.Carbohydrate,
        new DailyNutrientTotal(NutrientCode.Carbohydrate, 0),
      ],
    ]);

    const result = service.calculate(totals);

    expect(result.protein).toBeNull();
    expect(result.fat).toBeNull();
    expect(result.carbohydrate).toBeNull();
  });
});
