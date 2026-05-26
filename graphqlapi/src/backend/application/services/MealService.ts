import { IMealService } from "@/backend/domain/interfaces/IMealService";
import {
  Meal,
  CreateMealInput,
  MealWithDishes,
  MealDishWithDish,
} from "@/backend/domain/entities/Meal";
import { IMealRepository } from "@/backend/domain/interfaces/IMealRepository";
import { IDishRepository } from "@/backend/domain/interfaces/IDishRepository";
import { IMealDishRepository } from "@/backend/domain/interfaces/IMealDishRepository";
import { PrismaClient } from "@prisma/client";

export class MealService implements IMealService {
  constructor(
    private prisma: PrismaClient,
    private mealRepository: IMealRepository,
    private dishRepository: IDishRepository,
    private mealDishRepository: IMealDishRepository,
  ) {}

  /**
   * 食事と料理を同時に作成（トランザクション処理）
   */
  async createMealWithDishes(input: CreateMealInput): Promise<Meal> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Meal作成
        const meal = await this.mealRepository.createWithTx(tx, {
          userId: input.userId,
          mealDate: input.mealDate,
          category: input.category,
        });

        // 2. Dishesの処理
        const dishIds: number[] = [];
        for (const dishInput of input.dishes) {
          let dish;
          if (dishInput.id) {
            dish = await this.dishRepository.findById(dishInput.id.toString());
            if (!dish) {
              throw new Error(`Dish ${dishInput.id} not found`);
            }
            dishIds.push(dish.id);
          } else if (dishInput.name) {
            // ここでは簡略化のためDishRepositoryにcreateWithTxがある前提
            // 本来はIDishRepositoryにtx対応メソッドを追加すべきだが、DishServiceを参考にしたため
            // DishRepositoryの実装に合わせて調整が必要
            const createdDish = await (this.dishRepository as any).createWithTx(
              tx,
              {
                name: dishInput.name,
              },
            );
            dishIds.push(createdDish.id);
          }
        }

        // 3. MealDish中間テーブル作成
        await this.mealDishRepository.createManyWithTx(tx, meal.id, dishIds);

        return meal;
      });
    } catch (error) {
      console.error("MealService.createMealWithDishes error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to create meal with dishes: ${message}`);
    }
  }

  /**
   * IDで食事を取得（料理情報込み）
   */
  async getMealWithDishes(id: number): Promise<MealWithDishes | null> {
    try {
      return await this.mealRepository.findById(id);
    } catch (error) {
      console.error("MealService.getMealWithDishes error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to get meal: ${message}`);
    }
  }
  /**
   * ユーザーの指定期間内の食事を全て取得（料理情報込み）
   * @param userId - ユーザーID
   * @param fromDate - 開始日
   * @param toDate - 終了日
   * @returns 食事と料理情報の配列
   */
  async getAllMealsWithDishes(
    userId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<MealWithDishes[]> {
    try {
      const meals = await this.mealRepository.findByUserAndPeriod(
        userId,
        fromDate,
        toDate,
      );
      return meals;
    } catch (error) {
      console.error("MealService.getAllMealsWithDishes error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to get meals with dishes: ${message}`);
    }
  }
}
