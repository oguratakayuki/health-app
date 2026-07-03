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
import { UserProfileService } from "../UserProfileService";
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
  createUserProfileService,
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

  static createUserProfileService(context?: any): UserProfileService {
    if (context?.userProfileService) {
      return context.userProfileService;
    }
    return createUserProfileService();
  }

  // GraphQLコンテキストへ注入（DI）するための、
  // 各種ビジネスロジック（Service/UseCase）の初期化と
  // シングルトン管理（キャッシュ）を行うファクトリーメソッド
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
      userProfileService:
        context?.userProfileService || this.createUserProfileService(context),
    };
  }
  static setUsePrisma(usePrisma: boolean) {
    this.usePrisma = usePrisma;
  }
}
