// src/types/context.ts
import { DishService } from "@/application/services/DishService";
import { NutrientService } from "@/application/services/NutrientService";
import { IngredientService } from "@/application/services/IngredientService";
import { CognitoService } from "@/application/services/CognitoService";
import { UserService } from "@/application/services/UserService";
import { IngredientNutrientService } from "@/application/services/IngredientNutrientService";

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
