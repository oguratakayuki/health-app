import { CategoryResolver } from "./CategoryResolver";
import { IngredientResolver } from "./IngredientResolver";
import { IngredientNutrientResolver } from "./IngredientNutrientResolver";
import { IngredientTagResolver } from "./IngredientTagResolver";
import { NutrientResolver } from "./NutrientResolver";
import { TagResolver } from "./TagResolver";
import { TagCategoryResolver } from "./TagCategoryResolver";
import { UserResolver } from "./UserResolver";
import { AuthResolver } from "./AuthResolver";
import { MeResolver } from "./MeResolver";
// import { DishResolver } from "./DishResolver";
// import { DishIngredientResolver } from "./DishIngredientResolver";
import { TestResolver } from "./TestResolver"; 
import { PrismaDishResolver } from "./prisma/DishResolver";
import { PrismaNutrientResolver } from "./prisma/NutrientResolver";

export const resolvers = [
  CategoryResolver,
  IngredientResolver,
  IngredientNutrientResolver,
  IngredientTagResolver,
  NutrientResolver,
  TagResolver,
  TagCategoryResolver,
  UserResolver,
  AuthResolver,
  MeResolver,
  // DishResolver,
  // DishIngredientResolver,
  TestResolver,
  PrismaDishResolver,
  PrismaNutrientResolver,
] as const;

