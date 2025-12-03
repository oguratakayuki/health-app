import { DishService } from '../DishService';
import { NutrientService } from '../NutrientService';
import { IngredientService } from '../IngredientService';
import { createTypeORMDishService } from './TypeORMAdapter';
import { createPrismaDishService, createPrismaNutrientService, createPrismaIngredientService } from './PrismaAdapter';

/**
 * サービスファクトリー
 * ここで使用するデータソースを切り替え可能
 */
export class ServiceFactory {
  private static usePrisma = true; // 一時的にPrismaを使用
  static createDishService(): DishService {
    if (this.usePrisma) {
      return createPrismaDishService();
    }
    // else {
    //   return createTypeORMDishService();
    // }
    // デフォルトはPrisma
    return createPrismaDishService();
  }

  static createNutrientService(): NutrientService {
    return createPrismaNutrientService();
  }

  static createIngredientService(): IngredientService {
    return createPrismaIngredientService();
  }


  // データソースを切り替えるメソッド（開発用）
  static setUsePrisma(usePrisma: boolean) {
    this.usePrisma = usePrisma;
  }
}
