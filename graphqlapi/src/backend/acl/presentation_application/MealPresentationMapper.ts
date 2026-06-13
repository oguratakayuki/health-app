// src/backend/infrastructure/mappers/MealPresentationMapper.ts
import { CreateMealWithDishesInput } from "@/backend/infrastructure/graphql/inputs/prisma/CreateMealWithDishesInput";
import { CreateMealDto } from "@/backend/application/dtos/Meal";
import { UpdateMealInput } from "@/backend/infrastructure/graphql/inputs/prisma/UpdateMealInput";
import { UpdateMealUseCaseDto } from "@/backend/application/dtos/UpdateMealUseCaseDto";

import { Meal as MealEntity } from "@/backend/domain/entities/Meal";
import { Meal as GraphQLMeal } from "@/backend/infrastructure/graphql/types/Meal";

export class MealPresentationMapper {
  //上り 新規作成用：Presentation（GraphQL入力） ➔ Application（UseCase DTO）
  static toCreateDto(input: CreateMealWithDishesInput): CreateMealDto {
    // const baseDate = this.determineBaseDate(input.mealDate);

    return {
      userId: input.userId,
      mealDate: new Date(input.mealDate),
      category: input.category,
      startTime: input.startTime,
      endTime: input.endTime,
      // dishesがオプショナルのため、安全にマッピング（存在しない場合は空配列）
      dishes:
        input.dishes?.map((dish) => ({
          dishId: dish.id,
          name: dish.name,
        })) ?? [],
    };
  }

  // 【上り】更新用：Presentation（GraphQL入力） ➔ Application（UseCase DTO）
  static toServiceDto(
    userId: string,
    input: UpdateMealInput,
  ): UpdateMealUseCaseDto {
    // const baseDate = this.determineBaseDate(input.mealDate);

    return {
      mealDate: new Date(input.mealDate),
      category: input.category,
      userId: userId,
      addDishIds: input.addDishIds,
      removeDishIds: input.removeDishIds,
      startTime: input.startTime,
      endTime: input.endTime,
    };
  }

  // 【下り】Domain ➔ Presentation（GraphQL出力）
  static toGraphQLType(meal: MealEntity): GraphQLMeal {
    return {
      id: meal.id.toString(),
      category: meal.category,
      mealDate: meal.mealDate,
      startTime: this.formatTimeToStr(meal.startTime),
      endTime: this.formatTimeToStr(meal.endTime),
      userId: meal.userId.toString(),
      createdAt: meal.createdAt,
      updatedAt: meal.updatedAt,
    };
  }

  // --- 共通プライベート関数（リファクタリング） ---

  // ベースとなる日付の決定ロジックを共通化
  private static determineBaseDate(mealDate: Date | undefined): Date {
    return mealDate ? new Date(mealDate) : new Date(Date.UTC(1970, 0, 1));
  }

  // 純粋な日時の合成ロジック
  private static combineDateAndTime(baseDate: Date, timeStr: string): Date {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date(baseDate);
    date.setUTCHours(hours, minutes, 0, 0);
    return date;
  }

  // 時刻のフォーマット
  private static formatTimeToStr(date: Date): string {
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
}
