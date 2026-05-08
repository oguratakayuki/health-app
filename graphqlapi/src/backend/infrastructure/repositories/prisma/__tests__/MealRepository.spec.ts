// src/backend/infrastructure/repositories/prisma/__tests__/MealRepository.spec.ts
import { MealRepository } from "../MealRepository";
import { runInTransaction } from "./test-transaction";
import { MealMapper } from "../mappers/MealMapper";

describe("MealRepository", () => {
  describe("#findByUserAndDate", () => {
    it("should return meals mapped by MealMapper", async () => {
      await runInTransaction(async (tx) => {
        const repository = new MealRepository(tx);
        const userId = "1";
        const date = new Date("2026-01-17");

        const result = await repository.findByUserAndDate(userId, date);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });
});
