import { describe, it, expect } from "vitest";

import { DailyNutrientAggregatorService } from "@/backend/application/services/calculators/DailyNutrientAggregatorService";
import { NutrientCode } from "@/backend/domain/types/NutrientCode";

import { IDailyNutrientAggregationItem } from "@/backend/domain/interfaces/calculators/IDailyNutrientAggregationItem";

describe("DailyNutrientAggregatorService", () => {
  const service = new DailyNutrientAggregatorService();

  it("正常なデータを栄養素ごとに合算できる", () => {
    const items: IDailyNutrientAggregationItem[] = [
      {
        nutrientCode: NutrientCode.Protein,
        ingredientAmountGram: 100,
        nutrientPer100g: 10,
      },
      {
        nutrientCode: NutrientCode.Protein,
        ingredientAmountGram: 50,
        nutrientPer100g: 20,
      },
    ];

    const result = service.aggregate(items);

    expect(result.get(NutrientCode.Protein).value).toBe(20);
  });

  it("複数の栄養素を独立して合算できる", () => {
    const items: IDailyNutrientAggregationItem[] = [
      {
        nutrientCode: NutrientCode.Protein,
        ingredientAmountGram: 100,
        nutrientPer100g: 10,
      },
      {
        nutrientCode: NutrientCode.Fat,
        ingredientAmountGram: 50,
        nutrientPer100g: 20,
      },
    ];

    const result = service.aggregate(items);

    expect(result.get(NutrientCode.Protein).value).toBe(10);
    expect(result.get(NutrientCode.Fat).value).toBe(10);
  });

  it("1件でも ingredientAmountGram が null の場合、未計算になる", () => {
    const items: IDailyNutrientAggregationItem[] = [
      {
        nutrientCode: NutrientCode.Protein,
        ingredientAmountGram: 100,
        nutrientPer100g: 10,
      },
      {
        nutrientCode: NutrientCode.Protein,
        ingredientAmountGram: null,
        nutrientPer100g: 10,
      },
    ];

    const result = service.aggregate(items);

    expect(result.get(NutrientCode.Protein).isUncalculated()).toBe(true);
  });

  it("1件でも nutrientPer100g が null の場合、未計算になる", () => {
    const items: IDailyNutrientAggregationItem[] = [
      {
        nutrientCode: NutrientCode.Fat,
        ingredientAmountGram: 50,
        nutrientPer100g: 20,
      },
      {
        nutrientCode: NutrientCode.Fat,
        ingredientAmountGram: 30,
        nutrientPer100g: null,
      },
    ];

    const result = service.aggregate(items);

    expect(result.get(NutrientCode.Fat).isUncalculated()).toBe(true);
  });

  it("ingredientAmountGram が負の値の場合、例外を投げる", () => {
    const items: IDailyNutrientAggregationItem[] = [
      {
        nutrientCode: NutrientCode.Carbohydrate,
        ingredientAmountGram: -10,
        nutrientPer100g: 30,
      },
    ];

    expect(() => service.aggregate(items)).toThrow();
  });

  it("nutrientPer100g が負の値の場合、例外を投げる", () => {
    const items: IDailyNutrientAggregationItem[] = [
      {
        nutrientCode: NutrientCode.Carbohydrate,
        ingredientAmountGram: 100,
        nutrientPer100g: -30,
      },
    ];

    expect(() => service.aggregate(items)).toThrow();
  });
});
