import { DishService } from "../DishService";
import { UserService } from "../UserService";
import { CognitoService } from "../CognitoService";
import { NutrientService } from "../NutrientService";
import { NutrientsIntakeStandardService } from "../NutrientsIntakeStandardService";
import { IngredientService } from "../IngredientService";
import { IngredientNutrientService } from "../IngredientNutrientService";
import { PrismaDishRepository } from "@/backend/infrastructure/repositories/prisma/DishRepository";
import { PrismaNutrientRepository } from "@/backend/infrastructure/repositories/prisma/NutrientRepository";
import { NutrientsIntakeStandardRepository } from "@/backend/infrastructure/repositories/prisma/NutrientsIntakeStandardRepository";
import { PrismaIngredientRepository } from "@/backend/infrastructure/repositories/prisma/IngredientRepository";
import { IngredientNutrientRepository } from "@/backend/infrastructure/repositories/prisma/IngredientNutrientRepository";
import { UserRepository } from "@/backend/infrastructure/repositories/prisma/UserRepository";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma用のサービスアダプター
 */

let prismaInstance: PrismaClient | null = null;

function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    console.log("🔄 Creating new PrismaClient instance");
    // prismaInstance = new PrismaClient();
    prismaInstance = new PrismaClient({
      log: [
        { emit: "event", level: "query" },
        { emit: "event", level: "info" },
        { emit: "event", level: "warn" },
        { emit: "event", level: "error" },
      ],
    });
    prismaInstance.$on("query" as any, (e: any) => {
      console.log("=== Prisma Query ===");
      console.log("Query:", e.query);
      console.log("Params:", e.params);
      console.log("Duration:", e.duration, "ms");
      console.log("Timestamp:", e.timestamp);
      console.log("Target:", e.target);
      console.log("===================\n");
    });

    // 開発環境での接続確認
    if (process.env.NODE_ENV !== "production") {
      prismaInstance
        .$connect()
        .then(() => console.log("✅ PrismaClient connected"))
        .catch((err) =>
          console.warn("⚠️ PrismaClient connection warning:", err.message),
        );
    }
  }
  return prismaInstance;
}

export function createPrismaDishService(): DishService {
  const prisma = getPrismaClient();
  const repository = new PrismaDishRepository(prisma);
  return new DishService(repository);
}

export function createPrismaNutrientService(): NutrientService {
  const prisma = getPrismaClient();
  const repository = new PrismaNutrientRepository(prisma);
  return new NutrientService(repository);
}

export function createNutrientsIntakeStandardService(): NutrientsIntakeStandardService {
  const prisma = getPrismaClient();
  const repository = new NutrientsIntakeStandardRepository(prisma);
  return new NutrientsIntakeStandardService(repository);
}

export function createPrismaIngredientService(): IngredientService {
  const prisma = getPrismaClient();
  const repository = new PrismaIngredientRepository(prisma);
  return new IngredientService(repository);
}

export function createIngredientNutrientService(): IngredientNutrientService {
  const prisma = getPrismaClient();
  const repository = new IngredientNutrientRepository(prisma);
  return new IngredientNutrientService(repository);
}

export function createUserService(): UserService {
  const prisma = getPrismaClient();
  const repository = new UserRepository(prisma);
  return new UserService(repository);
}

export function createCognitoService(): CognitoService {
  const userService = createUserService();
  return new CognitoService(userService);
}
export function cleanupPrisma() {
  if (prismaInstance) {
    return prismaInstance.$disconnect();
  }
  return Promise.resolve();
}
