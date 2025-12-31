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
// import { DishIngredientResolver } from "./DishIngredientResolver";
import { NutrientResolver } from "./NutrientResolver";

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
] as const;
