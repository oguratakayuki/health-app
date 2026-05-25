import { Prisma } from "@prisma/client";

export interface IMealDishRepository {
  createManyWithTx(tx: Prisma.TransactionClient, mealId: number, dishIds: number[]): Promise<void>;
}
