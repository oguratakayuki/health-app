import { PrismaDishRepository } from './DishRepository';
// import { PrismaIngredientRepository } from './IngredientRepository';
// import { PrismaDishIngredientRepository } from './DishIngredientRepository';

export const prismaRepositories = {
  dish: new PrismaDishRepository(),
  // ingredient: new PrismaIngredientRepository(),
  // dishIngredient: new PrismaDishIngredientRepository(),
};

export type PrismaRepositories = typeof prismaRepositories;
