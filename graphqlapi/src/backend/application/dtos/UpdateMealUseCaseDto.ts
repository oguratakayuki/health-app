export interface UpdateMealUseCaseDto {
  mealDate?: Date;
  startTime?: Date;
  endTime?: Date;
  category?: string;
  userId?: string;
  addDishIds?: number[];
  removeDishIds?: number[];
}
