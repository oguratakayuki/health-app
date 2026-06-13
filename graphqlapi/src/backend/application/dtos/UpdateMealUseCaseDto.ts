export interface UpdateMealUseCaseDto {
  mealDate: Date;
  startTime: string;
  endTime: string;
  category: string;
  userId: string;
  addDishIds?: number[];
  removeDishIds?: number[];
}
