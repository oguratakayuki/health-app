// src/backend/infrastructure/repositories/prisma/__tests__/MealRepository.spec.ts
import { MealRepository } from "../MealRepository";
import { runInTransaction } from "./test-transaction";

describe("MealRepository", () => {
  describe("#getDailyNutrientSummary", () => {
    it("クエリが実行でき、例外なく結果を返すこと", async () => {
      await runInTransaction(async (tx) => {
        const repository = new MealRepository(tx);

        const userId = 1;
        const date = new Date("2026-01-17");

        const result = await repository.getDailyNutrientSummary(userId, date);
        console.log(result);

        // seedなしなので空配列でもOK
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });
});
