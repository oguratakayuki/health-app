import {
  Dish,
  DishWithIngredients,
  CreateDishRepositoryInput,
  UpdateDishRepositoryInput,
} from "@/backend/domain/entities/Dish";
import { Prisma } from "@prisma/client";

export interface IDishRepository {
  findById(id: string): Promise<DishWithIngredients | null>;
  findAll(): Promise<Dish[]>;
  create(dish: CreateDishRepositoryInput): Promise<Dish>;
  createWithTx(
    tx: Prisma.TransactionClient,
    dish: CreateDishRepositoryInput,
  ): Promise<Dish>;
  update(id: string, dish: UpdateDishRepositoryInput): Promise<Dish>;
  delete(id: string): Promise<boolean>;
  findByName(name: string): Promise<Dish[]>;
  count(): Promise<number>;
  findWithIngredients(id: string): Promise<DishWithIngredients | null>;
  findAllWithIngredients(): Promise<DishWithIngredients[]>;
}
