// backend/domain/interfaces/usecases/ICalculateDailyNutritionUseCase.ts

import { CalculateDailyNutritionResult } from "@/backend/application/usecases/CalculateDailyNutritionUseCase";

export interface ICalculateDailyNutritionUseCase {
  execute(userId: string, date: Date): Promise<CalculateDailyNutritionResult>;
}
