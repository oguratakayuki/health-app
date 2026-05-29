import { IMealService } from "@/backend/domain/interfaces/IMealService";
import {
  Meal,
  CreateMealInput,
  UpdateMealInput,
  MealWithDishes,
  MealDishWithDish,
} from "@/backend/domain/entities/Meal";
import { IMealRepository } from "@/backend/domain/interfaces/IMealRepository";
import { IDishRepository } from "@/backend/domain/interfaces/IDishRepository";
import { IMealDishRepository } from "@/backend/domain/interfaces/IMealDishRepository";
import { PrismaClient } from "@prisma/client";
import { UpdateMealUseCaseDto } from "@/backend/application/dtos/UpdateMealUseCaseDto";

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
      console.error("MealService.getAllMealsWithHdishes error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to get meals with dishes: ${message}`);
    }
  }

  async updateMeal(id: string, dto: UpdateMealUseCaseDto): Promise<Meal> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.meal.update({
          where: { id: parseInt(id) },
          data: {
            mealDate: dto.mealDate ? new Date(dto.mealDate) : undefined,
            category: dto.category,
            startTime: dto.startTime,
            endTime: dto.endTime,
            userId: BigInt(dto.userId),
          },
        });

        // 3. 料理の更新ロジック (差分抽出と重複排除)
        const currentMealDishes = await tx.mealDish.findMany({
          where: { mealId: parseInt(id) },
          select: { dishId: true },
        });
        const currentDishIds = currentMealDishes.map((md) => Number(md.dishId));

        // 3-a. 追加処理
        if (dto.addDishIds && dto.addDishIds.length > 0) {
          // 入力値をNumberに統一し、Setで重複排除
          const uniqueAddDishIds = Array.from(
            new Set(dto.addDishIds.map((id) => Number(id))),
          );
          // 既存データにないものだけを抽出
          const dishesToAdd = uniqueAddDishIds.filter(
            (dishId) => !currentDishIds.includes(dishId),
          );

          if (dishesToAdd.length > 0) {
            await tx.mealDish.createMany({
              data: dishesToAdd.map((dishId) => ({
                mealId: parseInt(id),
                dishId: dishId,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            });
          }
        }

        // 3-b. 削除処理
        if (dto.removeDishIds && dto.removeDishIds.length > 0) {
          // 入力値をNumberに統一
          const dishIdsToRemove = dto.removeDishIds.map((id) => Number(id));

          await tx.mealDish.deleteMany({
            where: {
              mealId: parseInt(id),
              dishId: { in: dishIdsToRemove },
            },
          });
        }

        // 4. 最新データの取得と返却
        const updatedMealWithDishes = await this.mealRepository.findById(
          parseInt(id),
        );
        return updatedMealWithDishes as unknown as Meal;
      });
    } catch (error) {
      console.error("MealService.updateMeal error:", error);
      throw error;
    }
  }

  async deleteMeal(id: string): Promise<boolean> {
    try {
      return await this.mealRepository.delete(parseInt(id));
    } catch (error) {
      console.error("MealService.deleteMeal error:", error);
      throw error;
    }
  }
}
