import { Dish, DishWithIngredients } from "@/backend/domain/entities/Dish";
import { CreateDishDto, UpdateDishDto } from "@/backend/application/dtos/Dish";

export interface IDishService {
  getDish(id: string): Promise<DishWithIngredients | null>;
  getAllDishes(): Promise<Dish[]>;
  getDishesWithIngredients(): Promise<DishWithIngredients[]>;
  createDish(dish: CreateDishDto): Promise<Dish>;
  updateDish(id: string, dish: UpdateDishDto): Promise<Dish>;
  deleteDish(id: string): Promise<boolean>;
  searchDishesByName(name: string): Promise<Dish[]>;
  getDishesCount(): Promise<number>;
}
