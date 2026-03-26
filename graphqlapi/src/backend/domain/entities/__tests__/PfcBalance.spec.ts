// backend/domain/entities/__tests__/PfcBalance.spec.ts

import { describe, it, expect } from "vitest";
import { PfcBalance } from "@/backend/domain/entities/PfcBalance";

describe("PfcBalance", () => {
  describe("hasAnyUncalculated()", () => {
    it("すべて計算済みの場合は false を返す", () => {
      const pfc = new PfcBalance({
        protein: 15,
        fat: 25,
        carbohydrate: 60,
      });

      expect(pfc.hasAnyUncalculated()).toBe(false);
    });

    it("protein が null の場合は true を返す", () => {
      const pfc = new PfcBalance({
        protein: null,
        fat: 25,
        carbohydrate: 60,
      });

      expect(pfc.hasAnyUncalculated()).toBe(true);
    });

    it("fat が null の場合は true を返す", () => {
      const pfc = new PfcBalance({
        protein: 15,
        fat: null,
        carbohydrate: 60,
      });

      expect(pfc.hasAnyUncalculated()).toBe(true);
    });

    it("carbohydrate が null の場合は true を返す", () => {
      const pfc = new PfcBalance({
        protein: 15,
        fat: 25,
        carbohydrate: null,
      });

      expect(pfc.hasAnyUncalculated()).toBe(true);
    });
  });

  describe("isBalanced()", () => {
    it("すべて範囲内の場合は true を返す", () => {
      const pfc = new PfcBalance({
        protein: 15,
        fat: 25,
        carbohydrate: 60,
      });

      expect(pfc.isBalanced()).toBe(true);
    });

    it("protein が下限未満の場合は false を返す", () => {
      const pfc = new PfcBalance({
        protein: 10,
        fat: 25,
        carbohydrate: 60,
      });

      expect(pfc.isBalanced()).toBe(false);
    });

    it("fat が上限超過の場合は false を返す", () => {
      const pfc = new PfcBalance({
        protein: 15,
        fat: 35,
        carbohydrate: 50,
      });

      expect(pfc.isBalanced()).toBe(false);
    });

    it("carbohydrate が範囲外の場合は false を返す", () => {
      const pfc = new PfcBalance({
        protein: 15,
        fat: 25,
        carbohydrate: 70,
      });

      expect(pfc.isBalanced()).toBe(false);
    });

    it("未計算(null)が含まれる場合は false を返す", () => {
      const pfc = new PfcBalance({
        protein: null,
        fat: 25,
        carbohydrate: 60,
      });

      expect(pfc.isBalanced()).toBe(false);
    });
  });
});
