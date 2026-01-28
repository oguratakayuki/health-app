// src/backend/domain/entities/Meal.ts
export interface IMeal {
  id: number;
  userId: number;
  mealDate: Date;
  mealType: string; // 'breakfast', 'lunch', 'dinner', 'snack'
  createdAt: Date;
  updatedAt: Date;
  // 関連エンティティ（オプション、循環参照を避ける）
  dishIds?: number[];
}

// 入力用DTO
export interface CreateMealInput {
  userId: number;
  mealDate: Date;
  mealType: string;
  dishIds: number[];
}

export interface UpdateMealInput {
  mealDate?: Date;
  mealType?: string;
  dishIds?: number[];
}
