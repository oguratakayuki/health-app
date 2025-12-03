import { DishService } from '../DishService';
import { NutrientService } from '../NutrientService';
import { IngredientService } from '../IngredientService';
import { PrismaDishRepository } from '../../repositories/prisma/DishRepository';
import { PrismaNutrientRepository } from '../../repositories/prisma/NutrientRepository';
import { PrismaIngredientRepository } from '../../repositories/prisma/IngredientRepository';

/**
 * Prisma用のサービスアダプター
 */
export function createPrismaDishService(): DishService {
  const repository = new PrismaDishRepository();
  return new DishService(repository);
}

export function createPrismaNutrientService(): NutrientService {
  const repository = new PrismaNutrientRepository();
  return new NutrientService(repository);
}

export function createPrismaIngredientService(): IngredientService {
  const repository = new PrismaIngredientRepository();
  return new IngredientService(repository);
}
