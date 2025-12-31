// src/types/context.ts
import { DishService } from "@/backend/application/services/DishService";
import { NutrientService } from "@/backend/application/services/NutrientService";
import { IngredientService } from "@/backend/application/services/IngredientService";
import { CognitoService } from "@/backend/application/services/CognitoService";
import { UserService } from "@/backend/application/services/UserService";
import { IngredientNutrientService } from "@/backend/application/services/IngredientNutrientService";

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
  nutrientService?: NutrientService;
  ingredientService?: IngredientService;
  cognitoService?: CognitoService;
  userService?: UserService;
  ingredientNutrientService?: IngredientNutrientService;
  // 後方互換性のためのPrismaクライアント
  prisma?: any;
}
