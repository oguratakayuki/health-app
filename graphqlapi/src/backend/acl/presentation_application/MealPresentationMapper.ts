// src/backend/infrastructure/mappers/MealPresentationMapper.ts
import { UpdateMealInput } from "@/backend/infrastructure/graphql/inputs/prisma/UpdateMealInput";
import { UpdateMealUseCaseDto } from "@/backend/application/dtos/UpdateMealUseCaseDto";

import { Meal as MealEntity } from "@/backend/domain/entities/Meal";
import { Meal as GraphQLMeal } from "@/backend/infrastructure/graphql/types/Meal";

export class MealPresentationMapper {
  // 【上り】Presentation（GraphQL入力） ➔ Application（UseCase DTO）
  static toServiceDto(
    userId: string,
    input: UpdateMealInput,
  ): UpdateMealUseCaseDto {
    // 1. ベースとなる日付の決定（送られてきた日付、無ければ固定の1970-01-01）
    // ※「今日」にしたい場合は `input.mealDate ? new Date(input.mealDate) : new Date()` にします
    const baseDate = input.mealDate
      ? new Date(input.mealDate)
      : new Date(Date.UTC(1970, 0, 1));

    return {
      mealDate: new Date(input.mealDate),
      category: input.category,
      userId: userId,
      addDishIds: input.addDishIds,
      removeDishIds: input.removeDishIds,
      // 2. 確定した baseDate を使って時間をDate型に合成
      startTime: this.combineDateAndTime(baseDate, input.startTime),
      endTime: this.combineDateAndTime(baseDate, input.endTime),
    };
  }

  static toGraphQLType(meal: MealEntity): GraphQLMeal {
    return {
      id: meal.id.toString(),
      category: meal.category,
      mealDate: meal.mealDate,
      // Dateオブジェクト から "12:30"
      startTime: this.formatTimeToStr(meal.startTime),
      endTime: this.formatTimeToStr(meal.endTime),
      userId: meal.userId.toString(), // BigInt ➔ string 変換
      createdAt: meal.createdAt,
      updatedAt: meal.updatedAt,
    };
  }

  // 純粋な日時の合成ロジック（マッパー内のプライベート関数に閉じ込める）
  private static combineDateAndTime(baseDate: Date, timeStr: string): Date {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date(baseDate);
    date.setUTCHours(hours, minutes, 0, 0);
    return date;
  }

  private static formatTimeToStr(date: Date): string {
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
}
