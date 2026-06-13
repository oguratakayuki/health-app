import { PrismaClient, Prisma } from "@prisma/client";
import { IMealDishRepository } from "@backend/domain/interfaces/IMealDishRepository";

export class MealDishRepository implements IMealDishRepository {
  constructor(private prismaClient: PrismaClient) {
    if (!prismaClient) {
      throw new Error("PrismaClient is required");
    }
  }

  async createManyWithTx(
    tx: Prisma.TransactionClient,
    mealId: number,
    dishIds: number[],
  ): Promise<void> {
    await tx.mealDish.createMany({
      data: dishIds.map((dishId) => ({
        mealId: mealId,
        dishId: dishId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
  }
}
