import { CategoryResolver } from "./CategoryResolver";
import { IngredientResolver } from "./IngredientResolver";
import { IngredientNutrientResolver } from "./IngredientNutrientResolver";
import { IngredientTagResolver } from "./IngredientTagResolver";
import { NutrientResolver } from "./NutrientResolver";
import { TagResolver } from "./TagResolver";
import { TagCategoryResolver } from "./TagCategoryResolver";

export const resolvers = [
  CategoryResolver,
  IngredientResolver,
  IngredientNutrientResolver,
  IngredientTagResolver,
  NutrientResolver,
  TagResolver,
  TagCategoryResolver,
] as const;

