import {
  DishIngredient,
  DishIngredientWithDetails,
  CreateDishIngredientInput,
} from "@/backend/domain/entities/DishIngredient";

export interface IDishIngredientRepository {
  findById(id: string): Promise<DishIngredientWithDetails | null>;
  findByDishId(dishId: string): Promise<DishIngredientWithDetails[]>;
  create(dishIngredient: CreateDishIngredientInput): Promise<DishIngredient>;
  update(
    id: string,
    contentQuantity: number,
    contentUnit: string,
  ): Promise<DishIngredient>;
  delete(id: string): Promise<boolean>;
  createMany(
    dishIngredients: CreateDishIngredientInput[],
  ): Promise<DishIngredient[]>;
  deleteByDishId(dishId: string): Promise<boolean>;
}
