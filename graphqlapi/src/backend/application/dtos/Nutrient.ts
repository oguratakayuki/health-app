export interface CreateNutrientDto {
  name: string;
  code: string;
  parentId?: string | null;
}

export interface UpdateNutrientDto {
  name: string;
  code: string;
  parentId?: string | null;
}
