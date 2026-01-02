import { NutrientsIntakeStandardRepository } from "../NutrientsIntakeStandardRepository";
import { PrismaNutrientRepository } from "../NutrientRepository";
import { runInTransaction } from "./test-transaction";
import {
  CreateNutrientsIntakeStandardInput,
  UpdateNutrientsIntakeStandardInput,
} from "@/backend/domain/entities/NutrientsIntakeStandard";

describe("NutrientsIntakeStandardRepository", () => {
  describe("#create", () => {
    it("摂取基準を作成できること（Enumが文字列で扱えること）", async () => {
      await runInTransaction(async (tx) => {
        const nutrientRepo = new PrismaNutrientRepository(tx);
        const repo = new NutrientsIntakeStandardRepository(tx);

        // 先に親となる栄養素を作成
        const nutrient = await nutrientRepo.create({
          name: "ビタミンC",
          parentId: null,
        });

        const input: CreateNutrientsIntakeStandardInput = {
          nutrientId: Number(nutrient.id),
          content: 100,
          unit: "mg", // 文字列として渡す
          gender: "male", // 文字列として渡す
          ageFrom: 18,
          ageTo: 29,
        };

        const created = await repo.create(input);

        expect(created.id).toBeDefined();
        expect(created.unit).toBe("mg"); // 文字列で返ってくること
        expect(created.gender).toBe("male"); // 文字列で返ってくること
        expect(created.content).toBe(100);
        expect(Number(created.nutrientId)).toBe(Number(nutrient.id));
      });
    });
  });

  describe("#findById", () => {
    it("IDで検索して、Enumが正しくマッピングされていること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new NutrientsIntakeStandardRepository(tx);
        // テストデータの作成 (unit: "μgRAE" は index: 3)
        const created = await repo.create({
          nutrientId: 1,
          content: 500,
          unit: "μgRAE",
          gender: "female",
          ageFrom: 30,
          ageTo: 49,
        });

        const found = await repo.findById(created.id);

        expect(found).not.toBeNull();
        expect(found?.unit).toBe("μgRAE");
        expect(found?.gender).toBe("female");
      });
    });
  });

  describe("#findByNutrientId", () => {
    it("特定の栄養素IDに紐づく基準を全件取得できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new NutrientsIntakeStandardRepository(tx);
        const targetId = 10;

        await repo.create({
          nutrientId: targetId,
          content: 10,
          unit: "g",
          gender: "male",
        });
        await repo.create({
          nutrientId: targetId,
          content: 20,
          unit: "g",
          gender: "female",
        });
        await repo.create({
          nutrientId: 99,
          content: 30,
          unit: "g",
          gender: "male",
        }); // 違うID

        const results = await repo.findByNutrientId(targetId);

        expect(results.length).toBe(2);
        results.forEach((r) => expect(r.nutrientId).toBe(targetId));
      });
    });
  });

  describe("#update", () => {
    it("基準値を更新できること（Enumの変更含む）", async () => {
      await runInTransaction(async (tx) => {
        const repo = new NutrientsIntakeStandardRepository(tx);

        const created = await repo.create({
          nutrientId: 1,
          content: 10,
          unit: "g",
          gender: "male",
        });

        const input: UpdateNutrientsIntakeStandardInput = {
          content: 15,
          unit: "kcal", // g -> kcal に変更
        };

        const updated = await repo.update(created.id, input);

        expect(updated.content).toBe(15);
        expect(updated.unit).toBe("kcal");
      });
    });
  });

  describe("#delete", () => {
    it("基準値を削除できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new NutrientsIntakeStandardRepository(tx);

        const created = await repo.create({
          nutrientId: 1,
          content: 100,
          unit: "mg",
          gender: "male",
        });

        const result = await repo.delete(created.id);
        expect(result).toBe(true);

        const found = await repo.findById(created.id);
        expect(found).toBeNull();
      });
    });
  });

  describe("#findAll", () => {
    it("栄養素情報を含めて取得できること", async () => {
      await runInTransaction(async (tx) => {
        const nutrientRepo = new PrismaNutrientRepository(tx);
        const repo = new NutrientsIntakeStandardRepository(tx);

        const nutrient = await nutrientRepo.create({
          name: "鉄",
          parentId: null,
        });
        await repo.create({
          nutrientId: Number(nutrient.id),
          content: 6,
          unit: "mg",
          gender: "male",
        });

        const results = await repo.findAll();

        expect(results.length).toBeGreaterThan(0);
        expect(results[0].nutrient).toBeDefined();
        expect(results[0].nutrient.name).toBe("鉄");
      });
    });
  });
});
