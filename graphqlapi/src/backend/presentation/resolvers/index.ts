import { IngredientResolver } from "./IngredientResolver";
import { IngredientNutrientResolver } from "./IngredientNutrientResolver";
// import { IngredientTagResolver } from "./IngredientTagResolver";
// import { NutrientResolver } from "./NutrientResolver";
// import { TagResolver } from "./TagResolver";
// import { TagCategoryResolver } from "./TagCategoryResolver";
import { UserResolver } from "./UserResolver";
// import { AuthResolver } from "./AuthResolver";
import { MeResolver } from "./MeResolver";
import { DishResolver } from "./DishResolver";
// import { DishIngredientResolver } from "./IngredientTagResolver";
import { NutrientResolver } from "./NutrientResolver";
import { NutrientsIntakeStandardResolver } from "./NutrientsIntakeStandardResolver";
import { MealResolver } from "./MealResolver";
import { UserProfileResolver } from "./UserProfileResolver";
import { BodyCompositionResolver } from "./BodyCompositionResolver";

export const resolvers = [
  IngredientResolver,
  IngredientNutrientResolver,
  // IngredientTagResolver,
  // NutrientResolver,
  // TagResolver,
  // TagCategoryResolver,
  UserResolver,
  // AuthResolver,
  MeResolver,
  // DishResolver,
  // DishIngredientResolver,
  DishResolver,
  NutrientResolver,
  NutrientsIntakeStandardResolver,
  MealResolver,
  UserProfileResolver,
  BodyCompositionResolver,
] as const;

