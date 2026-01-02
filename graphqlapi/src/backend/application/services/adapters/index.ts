// src/backend/application/services/adapters/index.ts
import { DishService } from "../DishService";
import { NutrientService } from "../NutrientService";
import { NutrientsIntakeStandardService } from "../NutrientsIntakeStandardService";
import { IngredientService } from "../IngredientService";
import { CognitoService } from "../CognitoService";
import { UserService } from "../UserService";
import { IngredientNutrientService } from "../IngredientNutrientService";

import {
  createPrismaDishService,
  createPrismaNutrientService,
  createPrismaIngredientService,
  createCognitoService,
  createUserService,
  createIngredientNutrientService,
  createNutrientsIntakeStandardService,
} from "./PrismaAdapter";

/**
 * サービスファクトリー
 * コンテキスト対応版
 */
export class ServiceFactory {
  private static usePrisma = true;

  static createDishService(context?: any): DishService {
    // コンテキストからサービスを取得できる場合はそれを使用
    if (context?.dishService) {
      return context.dishService;
    }
    // それ以外は通常通り作成
    return createPrismaDishService();
  }

  static createNutrientService(context?: any): NutrientService {
    if (context?.nutrientService) {
      return context.nutrientService;
    }
    return createPrismaNutrientService();
  }

  static createNutrientsIntakeStandardService(
    context?: any,
  ): NutrientsIntakeStandardService {
    if (context?.nutrientsIntakeStandardService) {
      return context.nutrientsIntakeStandardService;
    }
    return createNutrientsIntakeStandardService();
  }

  static createIngredientService(context?: any): IngredientService {
    if (context?.ingredientService) {
      return context.ingredientService;
    }
    return createPrismaIngredientService();
  }

  static createCognitoService(context?: any): CognitoService {
    if (context?.cognitoService) {
      return context.cognitoService;
    }
    return createCognitoService();
  }

  static createUserService(context?: any): UserService {
    if (context?.userService) {
      return context.userService;
    }
    return createUserService();
  }

  static createIngredientNutrientService(
    context?: any,
  ): IngredientNutrientService {
    if (context?.ingredientNutrientService) {
      return context.ingredientNutrientService;
    }
    return createIngredientNutrientService();
  }

  // ヘルパーメソッド: コンテキストからすべてのサービスを取得
  static getServicesFromContext(context?: any) {
    return {
      dishService: context?.dishService || this.createDishService(context),
      nutrientService:
        context?.nutrientService || this.createNutrientService(context),
      ingredientService:
        context?.ingredientService || this.createIngredientService(context),
      cognitoService:
        context?.cognitoService || this.createCognitoService(context),
      userService: context?.userService || this.createUserService(context),
      ingredientNutrientService:
        context?.ingredientNutrientService ||
        this.createIngredientNutrientService(context),
      nutrientsIntakeStandardService:
        context?.nutrientsIntakeStandard ||
        this.createNutrientsIntakeStandardService(context),
    };
  }

  static setUsePrisma(usePrisma: boolean) {
    this.usePrisma = usePrisma;
  }
}
