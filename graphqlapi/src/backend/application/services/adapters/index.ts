// src/backend/application/services/adapters/index.ts
import { DishService } from "../DishService";
import { NutrientService } from "../NutrientService";
import { NutrientsIntakeStandardService } from "../NutrientsIntakeStandardService";
import { IngredientService } from "../IngredientService";
import { CognitoService } from "../CognitoService";
import { UserService } from "../UserService";
import { IngredientNutrientService } from "../IngredientNutrientService";
import { MealService } from "../MealService";
import { CalculateDailyNutritionUseCase } from "../../usecases/CalculateDailyNutritionUseCase";
import {
  createPrismaDishService,
  createPrismaNutrientService,
  createPrismaIngredientService,
  createCognitoService,
  createUserService,
  createIngredientNutrientService,
  createNutrientsIntakeStandardService,
  createCalculateDailyNutritionUseCase,
  createPrismaMealService,
} from "./PrismaAdapter";
/**
 * サービスファクトリー
 * コンテキスト対応版
 */
export class ServiceFactory {
  private static usePrisma = true;
  static createDishService(context?: any): DishService {
    if (context?.dishService) {
      return context.dishService;
    }
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
  static createCalculateDailyNutritionUseCase(
    context?: any,
  ): CalculateDailyNutritionUseCase {
    if (context?.calculateDailyNutritionUseCase) {
      return context.calculateDailyNutritionUseCase;
    }
    return createCalculateDailyNutritionUseCase();
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

  static createMealService(context?: any): MealService {
    if (context?.mealService) {
      return context.mealService;
    }
    return createPrismaMealService();
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
      calculateDailyNutritionUseCase:
        context?.calculateDailyNutritionUseCase ||
        this.createCalculateDailyNutritionUseCase(context),
      mealService: context?.mealService || this.createMealService(context),
    };
  }
  static setUsePrisma(usePrisma: boolean) {
    this.usePrisma = usePrisma;
  }
}
