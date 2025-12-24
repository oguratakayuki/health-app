import { 
  Dish, 
  DishWithIngredients, 
  CreateDishInput, 
  UpdateDishInput 
} from '@/domain/entities/Dish';

export interface IDishRepository {
  findById(id: string): Promise<DishWithIngredients | null>;
  findAll(): Promise<Dish[]>;
  create(dish: CreateDishInput): Promise<Dish>;
  update(id: string, dish: UpdateDishInput): Promise<Dish>;
  delete(id: string): Promise<boolean>;
  findByName(name: string): Promise<Dish[]>;
  count(): Promise<number>;
  findWithIngredients(id: string): Promise<DishWithIngredients | null>;
  findAllWithIngredients(): Promise<DishWithIngredients[]>;
}
