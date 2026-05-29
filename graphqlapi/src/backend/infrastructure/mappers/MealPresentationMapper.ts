// src/backend/infrastructure/mappers/MealPresentationMapper.ts
import { UpdateMealInput } from "@/backend/infrastructure/graphql/inputs/prisma/UpdateMealInput";
import { UpdateMealUseCaseDto } from "@/backend/application/dtos/UpdateMealUseCaseDto";

export class MealPresentationMapper {
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
      mealDate: input.mealDate ? new Date(input.mealDate) : undefined,
      category: input.category,
      userId: userId,
      addDishIds: input.addDishIds,
      removeDishIds: input.removeDishIds,
      // 2. 確定した baseDate を使って時間をDate型に合成
      startTime: input.startTime
        ? this.combineDateAndTime(baseDate, input.startTime)
        : undefined,
      endTime: input.endTime
        ? this.combineDateAndTime(baseDate, input.endTime)
        : undefined,
    };
  }

  // 純粋な日時の合成ロジック（マッパー内のプライベート関数に閉じ込める）
  private static combineDateAndTime(baseDate: Date, timeStr: string): Date {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date(baseDate);
    date.setUTCHours(hours, minutes, 0, 0);
    return date;
  }
}
