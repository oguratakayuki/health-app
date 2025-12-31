/**
 * src/infrastructure/repositories/prisma/__tests__/NutrientRepository.spec.ts
 */
import { PrismaNutrientRepository } from "../NutrientRepository";
import { prisma, runInTransaction } from "../../../../../test-transaction";
import {
  CreateNutrientInput,
  UpdateNutrientInput,
} from "@/backend/domain/entities/Nutrient";

describe("PrismaNutrientRepository", () => {
  describe("#create", () => {
    it("栄養素を作成できること（parentIdなし）", async () => {
      await runInTransaction(async (tx) => {
        const repo = new PrismaNutrientRepository(tx);

        const input: CreateNutrientInput = {
          name: `Test Nutrient ${Date.now()}`,
          parentId: null,
        };

        const created = await repo.create(input);

        expect(created.id).toBeDefined();
        expect(created.name).toBe(input.name);
        expect(created.parentId).toBeNull();
        expect(created.createdAt).toBeInstanceOf(Date);
      });
    });

    it("parentIdを指定して作成できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new PrismaNutrientRepository(tx);

        // 親を先に作成
        const parent = await repo.create({
          name: `Parent ${Date.now()}`,
          parentId: null,
        });

        const child = await repo.create({
          name: `Child ${Date.now()}`,
          parentId: parent.id,
        });

        expect(child.parentId).toBe(parent.id);
      });
    });
  });

  describe("#findById", () => {
    it("IDで検索して取得できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new PrismaNutrientRepository(tx);

        const created = await repo.create({
          name: `Find ${Date.now()}`,
          parentId: null,
        });

        const found = await repo.findById(created.id);

        expect(found).not.toBeNull();
        expect(found?.id).toBe(created.id);
      });
    });

    it("存在しないIDはnullを返すこと", async () => {
      await runInTransaction(async (tx) => {
        const repo = new PrismaNutrientRepository(tx);

        const found = await repo.findById("999999999999");
        expect(found).toBeNull();
      });
    });
  });

  describe("#findAll", () => {
    it("複数の栄養素を取得できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new PrismaNutrientRepository(tx);

        await repo.create({ name: "N1", parentId: null });
        await repo.create({ name: "N2", parentId: null });

        const all = await repo.findAll();
        expect(all.length).toBe(2);
        expect(all[0].name).toBe("N1");
        expect(all[1].name).toBe("N2");
      });
    });
  });

  describe("#update", () => {
    it("栄養素を更新できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new PrismaNutrientRepository(tx);

        const created = await repo.create({
          name: "Before Update",
          parentId: null,
        });

        const input: UpdateNutrientInput = {
          name: "After Update",
          parentId: null,
        };

        const updated = await repo.update(created.id, input);

        expect(updated.name).toBe("After Update");
        expect(updated.updatedAt.getTime()).toBeGreaterThan(
          created.updatedAt.getTime(),
        );
      });
    });
  });

  describe("#delete", () => {
    it("栄養素を削除できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new PrismaNutrientRepository(tx);

        const created = await repo.create({
          name: "To Delete",
          parentId: null,
        });

        const result = await repo.delete(created.id);
        expect(result).toBe(true);

        const found = await repo.findById(created.id);
        expect(found).toBeNull();
      });
    });
  });

  describe("#findByName", () => {
    it("部分一致で検索できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new PrismaNutrientRepository(tx);

        await repo.create({ name: "Vitamin A", parentId: null });
        await repo.create({ name: "Vitamin C", parentId: null });

        const results = await repo.findByName("Vitamin");

        expect(results.length).toBe(2);
        expect(results[0].name).toContain("Vitamin");
      });
    });
  });

  describe("#findByParentId", () => {
    it("parentId に紐づく栄養素を取得できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new PrismaNutrientRepository(tx);

        const parent = await repo.create({
          name: "Parent",
          parentId: null,
        });

        await repo.create({
          name: "Child 1",
          parentId: parent.id,
        });

        await repo.create({
          name: "Child 2",
          parentId: parent.id,
        });

        const results = await repo.findByParentId(parent.id);

        expect(results.length).toBe(2);
        expect(results[0].parentId).toBe(parent.id);
      });
    });

    it("parentId が null の栄養素を取得できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new PrismaNutrientRepository(tx);

        await repo.create({ name: "Root1", parentId: null });
        await repo.create({ name: "Root2", parentId: null });

        const results = await repo.findByParentId(null);

        expect(results.length).toBe(2);
        expect(results[0].parentId).toBeNull();
      });
    });
  });

  describe("#count", () => {
    it("件数を取得できること", async () => {
      await runInTransaction(async (tx) => {
        const repo = new PrismaNutrientRepository(tx);

        await repo.create({ name: "N1", parentId: null });
        await repo.create({ name: "N2", parentId: null });

        const count = await repo.count();
        expect(count).toBe(2);
      });
    });
  });
});
