import { DishService } from '../DishService';
import { PrismaDishRepository } from '../../repositories/prisma/DishRepository';

/**
 * Prisma用のサービスアダプター
 */
export function createPrismaDishService(): DishService {
  const repository = new PrismaDishRepository();
  return new DishService(repository);
}
