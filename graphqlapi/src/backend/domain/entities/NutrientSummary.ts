// src/backend/domain/entities/NutrientSummary.ts
export interface DailyNutrientSummary {
  nutrientId: number;
  nutrientName: string;
  totalAmount: number;
  unit: string;
  rdiPercentage?: number;
}

// 週次や月次の集計用
export interface WeeklyNutrientSummary extends DailyNutrientSummary {
  weekNumber: number;
  averageDailyAmount: number;
}

// 食事詳細付きのレスポンス
export interface MealWithDetails {
  id: number;
  mealDate: Date;
  mealType: string;
  dishes: Array<{
    id: number;
    name: string;
    ingredients: Array<{
      id: number;
      name: string;
      quantity: number;
      unit: string;
      nutrients: Array<{
        nutrientId: number;
        nutrientName: string;
        amount: number;
        unit: string;
      }>;
    }>;
  }>;
}

// src/backend/domain/entities/NutrientSummary.ts

/**
 * 日次栄養素集計の基本インターフェース
 */
export interface DailyNutrientSummary {
  nutrientId: number;
  nutrientName: string;
  totalAmount: number; // 合計摂取量
  unit: string; // 単位（g, mg, μgなど）
  rdiPercentage?: number; // 1日の推奨摂取量に対する割合（%）
  createdAt?: Date; // 集計日時
}

/**
 * 食事タイプ別の栄養素集計
 */
export interface DailyNutrientSummaryByMealType extends DailyNutrientSummary {
  mealType: string; // 'breakfast', 'lunch', 'dinner', 'snack'
}

/**
 * 週次栄養素集計
 */
export interface WeeklyNutrientSummary {
  nutrientId: number;
  nutrientName: string;
  weekNumber: number; // 週番号（1-53）
  year: number;
  averageDailyAmount: number; // 1日あたりの平均摂取量
  totalWeeklyAmount: number; // 週合計摂取量
  unit: string;
  rdiPercentage?: number;
}

/**
 * 月次栄養素集計
 */
export interface MonthlyNutrientSummary {
  nutrientId: number;
  nutrientName: string;
  year: number;
  month: number; // 1-12
  averageDailyAmount: number;
  totalMonthlyAmount: number;
  unit: string;
  rdiPercentage?: number;
}
