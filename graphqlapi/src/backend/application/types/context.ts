// src/types/context.ts
import { DishService } from "@/backend/application/services/DishService";
import { NutrientService } from "@/backend/application/services/NutrientService";
import { NutrientsIntakeStandardService } from "@/backend/application/services/NutrientsIntakeStandardService";
import { IngredientService } from "@/backend/application/services/IngredientService";
import { CognitoService } from "@/backend/application/services/CognitoService";
import { UserService } from "@/backend/application/services/UserService";
import { IngredientNutrientService } from "@/backend/application/services/IngredientNutrientService";
import { MealService } from "@/backend/application/services/MealService";
import { CalculateDailyNutritionUseCase } from "@/backend/application/usecases/CalculateDailyNutritionUseCase";
import { UserProfileService } from "@/backend/application/services/UserProfileService";
export interface GraphQLContext {
  user?: {
    id: string;
    email: string;
    name?: string | null;
    cognitoSub?: string | null;
    isAdmin: boolean;
  };
  // サービスインスタンス
  dishService?: DishService;
  nutrientService?: NutrientService,
  ingredientService?: IngredientService;
  cognitoService?: CognitoService;
  userService?: UserService;
  ingredientNutrientService?: IngredientNutrientService;
  nutrientsIntakeStandardService: NutrientsIntakeStandardService;
  mealService?: MealService;
  // 後方互換性のためのPrismaクライアント
  prisma?: any;
  calculateDailyNutritionUseCase?: CalculateDailyNutritionUseCase;
  userProfileService?: UserProfileService;
}

