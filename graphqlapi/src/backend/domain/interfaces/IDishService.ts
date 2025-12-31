import {
  Dish,
  DishWithIngredients,
  CreateDishInput,
  UpdateDishInput,
} from "@/backend/domain/entities/Dish";

export interface IDishService {
  getDish(id: string): Promise<DishWithIngredients | null>;
  getAllDishes(): Promise<Dish[]>;
  getDishesWithIngredients(): Promise<DishWithIngredients[]>;
  createDish(dish: CreateDishInput): Promise<Dish>;
  updateDish(id: string, dish: UpdateDishInput): Promise<Dish>;
  deleteDish(id: string): Promise<boolean>;
  searchDishesByName(name: string): Promise<Dish[]>;
  getDishesCount(): Promise<number>;
}
