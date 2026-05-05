import { IngredientNutrientRepository } from "@/backend/infrastructure/repositories/prisma/IngredientNutrientRepository";
import { PrismaNutrientRepository } from "@/backend/infrastructure/repositories/prisma/NutrientRepository";
import { PrismaIngredientRepository } from "@/backend/infrastructure/repositories/prisma/IngredientRepository";
import { prisma, runInTransaction } from "./test-transaction";
import { NutrientCode } from "@/backend/domain/types/NutrientCode";

describe("IngredientNutrientRepository", () => {
  describe("#findByIngredientId", () => {
    it("食材IDに紐づく栄養素情報を取得できること", async () => {
      await runInTransaction(async (tx) => {
        const ingredientRepo = new PrismaIngredientRepository(tx);
        const nutrientRepo = new PrismaNutrientRepository(tx);
        const repo = new IngredientNutrientRepository(tx);

        // テストデータ作成
        const ingredient = await ingredientRepo.create({
          originalName: "Test Ingredient",
          name: "Test Ingredient",
          remarks: "test remarks",
        });

        const nutrient = await nutrientRepo.create({
          name: "エネルギー",
          code: "energy_kcal",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await repo.create({
          ingredientId: BigInt(ingredient.id),
          nutrientId: BigInt(nutrient.id),
          contentQuantity: 100,
          contentUnit: "kcal",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const results = await repo.findByIngredientId(ingredient.id.toString());

        expect(results.length).toBe(1);
        expect(results[0].contentQuantity).toBe(100);
        expect(results[0].nutrient?.code).toBe(NutrientCode.Energy);
        expect(results[0].ingredient?.name).toBe("Test Ingredient");
      });
    });

    it("紐づく栄養素がない場合は空配列を返すこと", async () => {
      await runInTransaction(async (tx) => {
        const repo = new IngredientNutrientRepository(tx);
        const results = await repo.findByIngredientId("999999");
        expect(results).toEqual([]);
      });
    });
  });

  describe("#findById", () => {
    it("IDで1件取得できること", async () => {
      await runInTransaction(async (tx) => {
        const ingredientRepo = new PrismaIngredientRepository(tx);
        const repo = new IngredientNutrientRepository(tx);
        const nutrientRepo = new PrismaNutrientRepository(tx);

        const ingredient = await ingredientRepo.create({
          name: "I1",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const nutrient = await nutrientRepo.create({
          name: "N1",
          code: "protein_g",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const created = await repo.create({
          ingredientId: ingredient.id,
          nutrientId: BigInt(nutrient.id),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const found = await repo.findById(created.id);

        expect(found).not.toBeNull();
        expect(found?.id.toString()).toBe(created.id.toString());
        expect(found?.ingredient?.name).toBe("I1");
        expect(found?.nutrient?.name).toBe("N1");
      });
    });

    it("存在しないIDはnullを返すこと", async () => {
      await runInTransaction(async (tx) => {
        const repo = new IngredientNutrientRepository(tx);
        const found = await repo.findById(BigInt(999999));
        expect(found).toBeNull();
      });
    });
  });

  describe("#findAll", () => {
    it("全件取得できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new IngredientNutrientRepository(tx);
        const ingredientRepo = new PrismaIngredientRepository(tx);
        const nutrientRepo = new PrismaNutrientRepository(tx);

        const ingredient = await ingredientRepo.create({
          name: "I1",
          originalName: "I1",
          remarks: "I1",
        });
        const nutrient = await nutrientRepo.create({
          name: "N1",
          code: "protein_g",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await repo.create({
          ingredientId: BigInt(ingredient.id),
          nutrientId: BigInt(nutrient.id),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const results = await repo.findAll();
        expect(results.length).toBeGreaterThanOrEqual(1);
        expect(results[0].ingredient).toBeDefined();
        expect(results[0].nutrient).toBeDefined();
      });
    });

    it("limitを指定して取得できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new IngredientNutrientRepository(tx);

        const ingredientRepo = new PrismaIngredientRepository(tx);
        const nutrientRepo = new PrismaNutrientRepository(tx);

        const ingredient = await ingredientRepo.create({
          name: "I1",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const n1 = await nutrientRepo.create({
          name: "N1",
          code: "protein_g",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const n2 = await nutrientRepo.create({
          name: "N2",
          code: "fat_g",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await repo.create({
          ingredientId: BigInt(ingredient.id),
          nutrientId: BigInt(n1.id),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await repo.create({
          ingredientId: BigInt(ingredient.id),
          nutrientId: BigInt(n2.id),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const results = await repo.findAll(1);
        expect(results.length).toBe(1);
      });
    });
  });

  describe("#findByIngredientIds", () => {
    it("複数の食材IDに紐づく栄養素情報を取得できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new IngredientNutrientRepository(tx);
        const ingredientRepo = new PrismaIngredientRepository(tx);
        const nutrientRepo = new PrismaNutrientRepository(tx);

        const i1 = await ingredientRepo.create({
          name: "I1",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const i2 = await ingredientRepo.create({
          name: "I2",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const nutrient = await nutrientRepo.create({
          name: "Protein",
          code: "protein_g", // mapNutrientCode expects this if it's bugged to use name, or it might be bugged
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await repo.create({
          ingredientId: BigInt(i1.id),
          nutrientId: BigInt(nutrient.id),
          contentQuantity: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await repo.create({
          ingredientId: BigInt(i2.id),
          nutrientId: BigInt(nutrient.id),
          contentQuantity: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const results = await repo.findByIngredientIds([
          BigInt(i1.id),
          BigInt(i2.id),
        ]);

        expect(results.length).toBe(2);
        const quantities = results
          .map((r) => r.contentQuantity)
          .sort((a, b) => (a || 0) - (b || 0));
        expect(quantities).toEqual([10, 20]);
      });
    });
  });

  describe(" unimplemented methods", () => {
    it("updateは未実装エラーを投げること", async () => {
      const repo = new IngredientNutrientRepository(prisma);
      await expect(repo.update(BigInt(1), {})).rejects.toThrow(
        "Method not implemented.",
      );
    });

    it("deleteは未実装エラーを投げること", async () => {
      const repo = new IngredientNutrientRepository(prisma);
      await expect(repo.delete(BigInt(1))).rejects.toThrow(
        "Method not implemented.",
      );
    });
  });
});
