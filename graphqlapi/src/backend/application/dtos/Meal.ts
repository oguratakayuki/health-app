// 入力用DTO
export interface CreateMealDto {
  userId: number;
  mealDate: Date;
  category: string;
  startTime: string;
  endTime: string;
  dishes: MealDishDto[];
}

export interface UpdateMealDto {
  mealDate: Date;
  category: string;
  startTime: string;
  endTime: string;
}

export interface MealDishDto {
  id?: number;
  name?: string;
}
