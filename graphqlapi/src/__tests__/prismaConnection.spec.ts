// src/__tests__/prismaConnection.spec.ts
import { PrismaClient } from "@prisma/client";

describe("Prisma DB connection (jest)", () => {
  const prisma = new PrismaClient();

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("接続先DB名と users テーブルの件数を確認できること", async () => {
    // DB名を確認
    const dbResult = await prisma.$queryRaw<
      { db_name: string }[]
    >`SELECT DATABASE() AS db_name`;

    const dbName = dbResult[0]?.db_name;
    console.log("Connected database:", dbName);

    // users テーブルの件数を確認
    const userCount = await prisma.user.count();
    console.log("User count:", userCount);

    // 最低限のアサーション
    expect(dbName).toBeTruthy();
    expect(typeof userCount).toBe("number");
  });
});
