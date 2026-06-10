// src/backend/infrastructure/repositories/prisma/__tests__/MealRepository.spec.ts
import { MealRepository } from "../MealRepository";
import { runInTransaction } from "@/backend/infrastructure/repositories/prisma/__tests__/test-transaction";
import { MealRepositoryMapper } from "@/backend/acl/domain_infrastructure/MealRepositoryMapper";

describe("MealRepository", () => {
  describe("#findByUserAndDate", () => {
    it("should return meals mapped by MealRepositoryMapper", async () => {
      await runInTransaction(async (tx) => {
        const repository = new MealRepository(tx);
        const userId = "1";
        const date = new Date("2026-01-17");

        const result = await repository.findByUserAndDate(userId, date);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe("#findByUserAndDate", () => {
    it("should return meals mapped by MealRepositoryMapper", async () => {
      await runInTransaction(async (tx) => {
        const repository = new MealRepository(tx);
        const userId = "1";
        const date = new Date("2026-01-17");

        const result = await repository.findByUserAndDate(userId, date);

        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe("#findByUserAndPeriod", () => {
    it("should return meals within the specified period", async () => {
      await runInTransaction(async (tx) => {
        const repository = new MealRepository(tx);

        const userId = "1";

        const from = new Date("2026-01-01");
        const to = new Date("2026-01-31");

        const user = await tx.user.create({
          data: {
            id: BigInt(1),
            name: "test-user",
            email: "test@example.com",
            cognitoSub: "aaa",
            createdAt: from,
            updatedAt: from,
          },
        });

        await tx.meal.create({
          data: {
            userId: user.id,
            mealDate: new Date("2026-01-10"),
            category: "lunch",
            createdAt: from,
            updatedAt: from,
          },
        });

        await tx.meal.create({
          data: {
            userId: user.id,
            mealDate: new Date("2026-01-20"),
            category: "lunch",
            createdAt: from,
            updatedAt: from,
          },
        });

        // 範囲外
        await tx.meal.create({
          data: {
            userId: user.id,
            mealDate: new Date("2026-02-10"),
            category: "lunch",
            createdAt: from,
            updatedAt: from,
          },
        });

        const result = await repository.findByUserAndPeriod(userId, from, to);

        expect(Array.isArray(result)).toBe(true);

        for (const meal of result) {
          expect(meal.mealDate >= from).toBe(true);
          expect(meal.mealDate <= to).toBe(true);
        }
      });
    });
  });
});
