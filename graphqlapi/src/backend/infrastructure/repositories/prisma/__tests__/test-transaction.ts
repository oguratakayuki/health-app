import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function runInTransaction(
  fn: (tx: PrismaClient) => Promise<void>,
) {
  await prisma
    .$transaction(async (tx) => {
      await fn(tx);
      throw new Error("__ROLLBACK__");
    })
    .catch((e) => {
      if (e.message !== "__ROLLBACK__") {
        throw e;
      }
    });
}
