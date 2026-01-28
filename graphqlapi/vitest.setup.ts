import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
  override: true,
});

import { beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import {
  seedTestIngredients,
  cleanupTestIngredients,
} from "./src/backend/infrastructure/prisma/seed/testSeed";

const prisma = new PrismaClient();

beforeAll(async () => {
  await seedTestIngredients(prisma);
});

afterAll(async () => {
  await cleanupTestIngredients(prisma);
  await prisma.$disconnect();
});
