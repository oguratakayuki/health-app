import { DishService } from '../DishService';
import { NutrientService } from '../NutrientService';
import { PrismaDishRepository } from '../../repositories/prisma/DishRepository';
import { PrismaNutrientRepository } from '../../repositories/prisma/NutrientRepository';

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
